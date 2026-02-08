import type {
  AnalyticsConfig,
  AnalyticsEvent,
  EventProperties,
  UserTraits,
  EventContext,
} from "./types";
import { Transport } from "./transport";
import { EventQueue } from "./queue";

/**
 * Gerador de ID anônimo
 */
function generateAnonymousId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtém ou cria anonymousId no localStorage
 */
function getAnonymousId(): string {
  const key = "analytics_anonymous_id";
  let id = localStorage.getItem(key);

  if (!id) {
    id = generateAnonymousId();
    localStorage.setItem(key, id);
  }

  return id;
}

/**
 * Coleta contexto automático do evento
 */
function getEventContext(): EventContext {
  return {
    page: {
      url: window.location.href,
      path: window.location.pathname,
      title: document.title,
      referrer: document.referrer,
    },
    userAgent: navigator.userAgent,
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
  };
}

/**
 * Classe principal do Analytics SDK
 */
export class Analytics {
  private config: Required<AnalyticsConfig>;
  private transport: Transport;
  private queue: EventQueue;
  private userId?: string;
  private userTraits?: UserTraits;
  private anonymousId: string;

  constructor(config: AnalyticsConfig) {
    // Configuração padrão
    this.config = {
      apiUrl: config.apiUrl,
      batchSize: config.batchSize ?? 10,
      flushInterval: config.flushInterval ?? 5000,
      maxRetries: config.maxRetries ?? 3,
      debug: config.debug ?? false,
      disableAutoPageview: config.disableAutoPageview ?? false,
    };

    this.anonymousId = getAnonymousId();
    this.transport = new Transport(
      this.config.apiUrl,
      this.config.maxRetries,
      this.config.debug,
    );
    this.queue = new EventQueue(
      this.transport,
      this.config.batchSize,
      this.config.flushInterval,
    );

    // Pageview automático
    if (!this.config.disableAutoPageview) {
      this.pageview();
    }

    if (this.config.debug) {
      console.log("[Analytics] Initialized with config:", this.config);
    }
  }

  /**
   * Identifica o usuário
   */
  identify(userId: string, traits?: UserTraits): void {
    this.userId = userId;
    this.userTraits = traits;

    this.createAndEnqueueEvent(
      {
        type: "identify",
        userId,
        traits,
      },
      `User identified: ${userId}`,
    );
  }

  /**
   * Rastreia um evento customizado
   */
  track(eventName: string, properties?: EventProperties): void {
    this.createAndEnqueueEvent(
      {
        type: "track",
        event: eventName,
        properties,
        userId: this.userId,
      },
      `Event tracked: ${eventName}`,
      properties,
    );
  }

  /**
   * Rastreia visualização de página
   */
  pageview(properties?: EventProperties): void {
    this.createAndEnqueueEvent(
      {
        type: "page",
        properties,
        userId: this.userId,
      },
      "Pageview tracked",
    );
  }

  /**
   * Força envio imediato dos eventos na fila
   */
  async flush(): Promise<void> {
    await this.queue.flush();
  }

  /**
   * Retorna o userId atual
   */
  getUserId(): string | undefined {
    return this.userId;
  }

  /**
   * Retorna o anonymousId
   */
  getAnonymousId(): string {
    return this.anonymousId;
  }

  /**
   * Para o SDK e limpa recursos
   */
  shutdown(): void {
    this.queue.stop();
    this.queue.clear();
  }

  private createAndEnqueueEvent(
    eventData: Partial<AnalyticsEvent>,
    debugMessage: string,
    debugData?: any,
  ): void {
    const event: AnalyticsEvent = {
      ...eventData,
      timestamp: Date.now(),
      anonymousId: this.anonymousId,
      context: getEventContext(),
    } as AnalyticsEvent;

    this.queue.enqueue(event);

    if (this.config.debug) {
      console.log(
        `[Analytics] ${debugMessage}`,
        debugData !== undefined ? debugData : "",
      );
    }
  }
}
