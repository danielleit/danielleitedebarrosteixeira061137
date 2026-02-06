package br.gov.seplag.artists_api.common.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Filtro para implementar Rate Limiting.
 * Máximo de 10 requisições por minuto por usuário.
 */
@Component
public class RateLimitFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final long ONE_MINUTE_IN_MILLIS = 60000;

    private final Map<String, UserRateLimit> userLimits = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Ignora rate limit para endpoints públicos
        String requestURI = httpRequest.getRequestURI();
        if (requestURI.startsWith("/api/v1/auth/") || 
            requestURI.startsWith("/actuator/") ||
            requestURI.startsWith("/swagger-ui") ||
            requestURI.startsWith("/v3/api-docs")) {
            chain.doFilter(request, response);
            return;
        }

        String username = extractUsername(httpRequest);
        if (username == null) {
            username = httpRequest.getRemoteAddr(); // Fallback para IP
        }

        UserRateLimit rateLimit = userLimits.computeIfAbsent(username, k -> new UserRateLimit());

        if (!rateLimit.allowRequest()) {
            httpResponse.setStatus(429); // Too Many Requests
            httpResponse.setContentType("application/json");
            httpResponse.getWriter().write(
                "{\"error\": \"Rate limit excedido\", \"message\": \"Máximo de 10 requisições por minuto\"}"
            );
            return;
        }

        chain.doFilter(request, response);
    }

    private String extractUsername(HttpServletRequest request) {
        // Extrai username do contexto de segurança ou token
        return request.getUserPrincipal() != null ? request.getUserPrincipal().getName() : null;
    }

    private static class UserRateLimit {
        private final Map<Long, Integer> requestCounts = new HashMap<>();

        public synchronized boolean allowRequest() {
            long currentMinute = System.currentTimeMillis() / ONE_MINUTE_IN_MILLIS;
            
            // Limpa requisições antigas
            requestCounts.entrySet().removeIf(entry -> entry.getKey() < currentMinute);

            int count = requestCounts.getOrDefault(currentMinute, 0);
            
            if (count >= MAX_REQUESTS_PER_MINUTE) {
                return false;
            }

            requestCounts.put(currentMinute, count + 1);
            return true;
        }
    }
}
