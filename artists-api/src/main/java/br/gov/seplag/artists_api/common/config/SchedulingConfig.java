package br.gov.seplag.artists_api.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Habilita agendamento de tarefas (para sincronização de regionais).
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
