export interface WhoisDataGroup {
  [key: string]: string;
}

export interface DomainWhoisData {
  "Domain Name"?: string;
  "Domain Status"?: string[];
  "Name Server"?: string[];
  text?: string[];
  [key: string]: string | string[] | undefined;
}

// Simplified entity for our domain logic, similar to the library but decoupled
export class WhoisEntity {
  constructor(
    public readonly rawData: Record<string, DomainWhoisData>,
    public readonly registryData?: DomainWhoisData,
    public readonly registrarData?: DomainWhoisData
  ) {}
}
