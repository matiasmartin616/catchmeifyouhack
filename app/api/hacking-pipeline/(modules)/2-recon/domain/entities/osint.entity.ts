import { WhoisEntity } from "./whois.entity";

export class OsintEntity {
  constructor(
    public whois: WhoisEntity | null,
    public dns: Record<string, string[]> | null,
    public subdomains: string[] | null,
    public geoIp: {
      ip: string;
      country: string;
      city?: string;
      isp?: string;
      asn?: string;
      org?: string;
    } | null
  ) {}
}
