import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestPasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String password = "admin123";
        String hashFromDB = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";
        
        // Testar se o hash atual corresponde
        boolean matches = encoder.matches(password, hashFromDB);
        System.out.println("Hash atual corresponde a 'admin123': " + matches);
        
        // Gerar novo hash correto
        String correctHash = encoder.encode(password);
        System.out.println("\nHash correto para 'admin123':");
        System.out.println(correctHash);
        
        // Gerar mais alguns para escolher
        System.out.println("\nOutras opções de hash BCrypt para 'admin123':");
        System.out.println(encoder.encode(password));
        System.out.println(encoder.encode(password));
    }
}
