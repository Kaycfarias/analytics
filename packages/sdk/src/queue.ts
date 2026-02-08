import type { AnalyticsEvent } from "./types";
import { Transport } from "./transport";

/**
 * Fila de eventos com auto-flush
 */
export class EventQueue {
  private queue: AnalyticsEvent[] = [];
  private transport: Transport;
  private batchSize: number;
  private flushInterval: number;
  private flushTimer?: number;
  private isFlushing: boolean = false;

  constructor(
    transport: Transport,
    batchSize: number = 10,
    flushInterval: number = 5000,
  ) {
    this.transport = transport;
    this.batchSize = batchSize;
    this.flushInterval = flushInterval;

    // Auto-flush em intervalos regulares
    this.startFlushTimer();

    // Flush antes de sair da página
    this.setupBeforeUnload();
  }

  /**
   * Adiciona evento à fila
   */
  enqueue(event: AnalyticsEvent): void {
    this.queue.push(event);

    // Flush automático quando atingir batch size
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }

  /**
   * Envia todos os eventos da fila
   */
  async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) {
      return;
    }

    this.isFlushing = true;

    const events = [...this.queue];
    this.queue = [];

    try {
      await this.transport.send(events);
    } catch (error) {
      // Em caso de erro, recoloca eventos na fila
      this.queue.unshift(...events);
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Retorna número de eventos na fila
   */
  size(): number {
    return this.queue.length;
  }

  /**
   * Limpa a fila
   */
  clear(): void {
    this.queue = [];
  }

  /**
   * Para o flush timer
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = window.setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private flushViaBeacon(): void {
    if (this.queue.length > 0) {
      this.transport.sendBeacon([...this.queue]);
      this.queue = [];
    }
  }

  private setupBeforeUnload(): void {
    // Usa sendBeacon para garantir envio antes de sair
    window.addEventListener("beforeunload", () => {
      this.flushViaBeacon();
    });

    // Também flush em visibilitychange (mobile)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flushViaBeacon();
      }
    });
  }
}
