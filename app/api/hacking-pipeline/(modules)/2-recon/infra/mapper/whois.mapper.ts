import {
  WhoisEntity,
  DomainWhoisData,
} from "../../domain/entities/whois.entity";

interface WhoiserLibResponse {
  [key: string]: {
    "Domain Name"?: string;
    "Domain Status"?: string[];
    "Name Server"?: string[];
    text?: string[];
    [key: string]: string | string[] | undefined;
  };
}

export class WhoisMapper {
  static toDomain(rawResponse: WhoiserLibResponse): WhoisEntity {
    const keys = Object.keys(rawResponse);
    let registryData: DomainWhoisData | undefined;
    let registrarData: DomainWhoisData | undefined;

    if (keys.length > 0) {
      registryData = rawResponse[keys[0]];
    }
    if (keys.length > 1) {
      registrarData = rawResponse[keys[1]];
    }

    return new WhoisEntity(rawResponse, registryData, registrarData);
  }
}
