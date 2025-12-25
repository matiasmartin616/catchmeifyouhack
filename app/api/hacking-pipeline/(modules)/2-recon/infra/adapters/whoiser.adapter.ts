import { whoisDomain } from "whoiser";
import { WhoisAdapterPort } from "../ports/osint.ports";
import { WhoisMapper } from "../mapper/whois.mapper";
import { WhoisEntity } from "../../domain/entities/whois.entity";

export class WhoiserAdapter implements WhoisAdapterPort {
  async lookup(domain: string): Promise<WhoisEntity | null> {
    try {
      const result = await whoisDomain(domain);

      if (!result || Object.keys(result).length === 0) {
        return null;
      }

      return WhoisMapper.toDomain(result);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.warn(`WHOIS lookup failed for ${domain}: ${errorMessage}`);
      return null;
    }
  }
}
