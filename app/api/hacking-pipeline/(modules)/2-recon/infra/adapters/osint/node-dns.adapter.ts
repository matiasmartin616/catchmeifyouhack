import { promises as dns } from "node:dns";
import {
  MxRecord,
  SoaRecord,
  NaptrRecord,
  SrvRecord,
  CaaRecord,
  AnyRecord,
} from "node:dns";
import { DnsAdapterPort } from "../../ports/osint.ports";

type DnsRecordResult =
  | string[]
  | MxRecord[]
  | NaptrRecord[]
  | SoaRecord
  | SrvRecord[]
  | string[][]
  | CaaRecord[]
  | AnyRecord[];

export class NodeDnsAdapter implements DnsAdapterPort {
  async resolveAll(domain: string): Promise<Record<string, string[]>> {
    const records: Record<string, string[]> = {};
    const types = ["A", "AAAA", "MX", "TXT", "NS", "CNAME"] as const;

    await Promise.all(
      types.map(async (type) => {
        try {
          const result = await dns.resolve(domain, type);
          if (result) {
            records[type] = this.formatDnsResult(result as DnsRecordResult);
          }
        } catch {}
      })
    );

    return records;
  }

  private formatDnsResult(result: DnsRecordResult): string[] {
    if (Array.isArray(result)) {
      return result.map((r) => {
        if (typeof r === "string") return r;
        if (Array.isArray(r)) return r.join(" ");
        return JSON.stringify(r);
      });
    }
    return [JSON.stringify(result)];
  }
}
