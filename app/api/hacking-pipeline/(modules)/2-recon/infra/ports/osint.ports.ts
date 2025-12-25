import { WhoisEntity } from "../../domain/entities/whois.entity";

export interface WhoisAdapterPort {
  lookup(domain: string): Promise<WhoisEntity | null>;
}

export interface DnsAdapterPort {
  resolveAll(domain: string): Promise<Record<string, string[]>>;
}

export interface SubdomainAdapterPort {
  findSubdomains(domain: string): Promise<string[]>;
}

export interface GeoIpAdapterPort {
  lookup(ipOrDomain: string): Promise<{
    ip: string;
    country: string;
    city?: string;
    isp?: string;
    asn?: string;
    org?: string;
  }>;
}
