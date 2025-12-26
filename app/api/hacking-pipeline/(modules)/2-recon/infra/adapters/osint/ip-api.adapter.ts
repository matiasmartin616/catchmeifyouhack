import axios from "axios";
import { promises as dns } from "node:dns";
import { GeoIpAdapterPort } from "../../ports/osint.ports";

interface IpApiResponse {
  status: "success" | "fail";
  message?: string;
  query: string;
  country: string;
  city: string;
  isp: string;
  org: string;
  as: string;
}

export class IpApiAdapter implements GeoIpAdapterPort {
  async lookup(ipOrDomain: string): Promise<{
    ip: string;
    country: string;
    city?: string;
    isp?: string;
    asn?: string;
    org?: string;
  }> {
    try {
      let ip = ipOrDomain;
      if (!this.isIp(ipOrDomain)) {
        const addresses = await dns.resolve4(ipOrDomain).catch(() => []);
        if (addresses.length === 0) throw new Error("No IP found");
        ip = addresses[0];
      }

      const response = await axios.get<IpApiResponse>(
        `http://ip-api.com/json/${ip}`
      );
      const data = response.data;

      if (data.status === "fail") {
        throw new Error(data.message || "GeoIP lookup failed");
      }

      return {
        ip: data.query,
        country: data.country,
        city: data.city,
        isp: data.isp,
        asn: data.as,
        org: data.org,
      };
    } catch (error) {
      console.error(`Error fetching GeoIP for ${ipOrDomain}:`, error);
      return { ip: "", country: "", asn: "" }; // Return empty on failure
    }
  }

  private isIp(value: string): boolean {
    return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value);
  }
}
