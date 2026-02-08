/**
 * Propriedades customizadas de um evento
 */
export type EventProperties = Record<string, any>;

/**
 * Dados do usuário
 */
export interface UserTraits {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

/**
 * Evento base
 */
export interface AnalyticsEvent {
  type: "track" | "page" | "identify";
  timestamp: number;
  event?: string;
  properties?: EventProperties;
  userId?: string;
  anonymousId?: string;
  traits?: UserTraits;
  context?: EventContext;
}

/**
 * Contexto automático do evento
 */
export interface EventContext {
  page?: {
    url: string;
    path: string;
    title: string;
    referrer: string;
  };
  userAgent?: string;
  locale?: string;
  timezone?: string;
  screen?: {
    width: number;
    height: number;
  };
}

/**
 * Configuração do SDK
 */
export interface AnalyticsConfig {
  /** URL da API de coleta */
  apiUrl: string;

  /** Tamanho máximo do batch de eventos */
  batchSize?: number;

  /** Tempo máximo (ms) antes de enviar batch */
  flushInterval?: number;

  /** Número de tentativas em caso de falha */
  maxRetries?: number;

  /** Habilitar logs de debug */
  debug?: boolean;

  /** Desabilitar tracking automático de pageviews */
  disableAutoPageview?: boolean;
}

/**
 * Status de envio
 */
export interface SendResult {
  success: boolean;
  error?: Error;
}
