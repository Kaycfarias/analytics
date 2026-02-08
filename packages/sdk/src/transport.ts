import type { AnalyticsEvent, SendResult } from "./types";

/**
 * Transport layer para envio de eventos
 */
export class Transport {
  private apiUrl: string;
  private maxRetries: number;
  private debug: boolean;

  constructor(apiUrl: string, maxRetries: number = 3, debug: boolean = false) {
    this.apiUrl = apiUrl;
    this.maxRetries = maxRetries;
    this.debug = debug;
  }

  /**
   * Envia um batch de eventos para a API
   */
  async send(events: AnalyticsEvent[]): Promise<SendResult> {
    if (events.length === 0) {
      return { success: true };
    }

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        if (this.debug) {
          console.log(
            `[Analytics] Sending ${events.length} events (attempt ${attempt + 1})`,
          );
        }

        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ events }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (this.debug) {
          console.log("[Analytics] Events sent successfully");
        }

        return { success: true };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (this.debug) {
          console.warn(
            `[Analytics] Send failed (attempt ${attempt + 1}):`,
            lastError.message,
          );
        }

        // Aguarda antes de retry (exponential backoff)
        if (attempt < this.maxRetries) {
          await this.sleep(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return { success: false, error: lastError };
  }

  /**
   * Envia evento único usando sendBeacon (para unload)
   */
  sendBeacon(events: AnalyticsEvent[]): boolean {
    if (events.length === 0 || !navigator.sendBeacon) {
      return false;
    }

    try {
      const blob = new Blob([JSON.stringify({ events })], {
        type: "application/json",
      });

      return navigator.sendBeacon(this.apiUrl, blob);
    } catch (error) {
      if (this.debug) {
        console.warn("[Analytics] sendBeacon failed:", error);
      }
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
