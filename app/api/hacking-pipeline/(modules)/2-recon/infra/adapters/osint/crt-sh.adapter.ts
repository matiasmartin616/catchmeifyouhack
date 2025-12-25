import axios from "axios";
import { SubdomainAdapterPort } from "../../ports/osint.ports";

interface CrtShEntry {
  name_value: string;
}

export class CrtShAdapter implements SubdomainAdapterPort {
  async findSubdomains(domain: string): Promise<string[]> {
    const start = Date.now();
    console.log(
      `[CrtShAdapter] Starting fetch for ${domain} at ${new Date().toISOString()}`
    );

    try {
      // Increased timeout to 25s as crt.sh is often slow.
      // Using a realistic User-Agent to avoid potential blocks.
      const response = await axios.get<CrtShEntry[]>(
        `https://crt.sh/?q=%.${domain}&output=json`,
        {
          timeout: 25000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        }
      );

      console.log(
        `[CrtShAdapter] Success for ${domain} in ${Date.now() - start}ms`
      );

      if (!Array.isArray(response.data)) return [];

      const subdomains = new Set<string>();
      response.data.forEach((entry) => {
        const nameValue = entry.name_value;
        if (nameValue) {
          nameValue.split("\n").forEach((sub) => {
            if (!sub.includes("*") && sub.endsWith(domain)) {
              subdomains.add(sub);
            }
          });
        }
      });

      return Array.from(subdomains);
    } catch (error: unknown) {
      const duration = Date.now() - start;
      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          console.warn(
            `[CrtShAdapter] Timeout fetching subdomains for ${domain} after ${duration}ms. Skipping.`
          );
        } else {
          console.error(
            `[CrtShAdapter] Error fetching subdomains for ${domain}: ${error.message}`
          );
        }
      } else {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `[CrtShAdapter] Unknown Error for ${domain}: ${errorMessage}`
        );
      }
      return [];
    }
  }
}
