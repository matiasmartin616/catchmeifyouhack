import { OsintEntity } from "../domain/entities";
import { OsintServiceInterface } from "./osint.service.i";
import {
  WhoisAdapterPort,
  DnsAdapterPort,
  SubdomainAdapterPort,
  GeoIpAdapterPort,
} from "../infra/ports/osint.ports";
import {
  WhoiserAdapter,
  NodeDnsAdapter,
  CrtShAdapter,
  IpApiAdapter,
} from "../infra/adapters/osint";

export class OsintService implements OsintServiceInterface {
  constructor(
    private readonly whoisAdapter: WhoisAdapterPort,
    private readonly dnsAdapter: DnsAdapterPort,
    private readonly subdomainAdapter: SubdomainAdapterPort,
    private readonly geoIpAdapter: GeoIpAdapterPort
  ) {}

  async gatherOsint(target: string): Promise<OsintEntity> {
    const domain = this.cleanTarget(target);

    // Run independent tasks in parallel using adapters
    const [whoisData, dnsRecords, subdomains, geoIp] = await Promise.allSettled(
      [
        this.whoisAdapter.lookup(domain),
        this.dnsAdapter.resolveAll(domain),
        this.subdomainAdapter.findSubdomains(domain),
        this.geoIpAdapter.lookup(domain),
      ]
    );

    return new OsintEntity(
      whoisData.status === "fulfilled" ? whoisData.value : null,
      dnsRecords.status === "fulfilled" ? dnsRecords.value : {},
      subdomains.status === "fulfilled" ? subdomains.value : [],
      geoIp.status === "fulfilled"
        ? geoIp.value
        : { ip: "", country: "", asn: "" }
    );
  }

  private cleanTarget(target: string): string {
    return target
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "")
      .toLowerCase();
  }
}

// Instantiate with concrete adapters
export const osintService = new OsintService(
  new WhoiserAdapter(),
  new NodeDnsAdapter(),
  new CrtShAdapter(),
  new IpApiAdapter()
);
