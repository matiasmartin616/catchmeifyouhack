import { TechStackPort } from "../../ports/tech-stack.port";
import { TechStackEntity } from "../../../domain/entities/tech-stack.entity";
import puppeteer from "puppeteer";
// @ts-expect-error simple-wappalyzer does not have types
import wappalyzer from "simple-wappalyzer";

interface WappalyzerCategory {
  id: number;
  slug: string;
  name: string;
  priority: number;
  groups?: number[];
}

interface WappalyzerApp {
  name: string;
  confidence: number;
  version: string;
  icon: string;
  website: string;
  cpe: string | null;
  categories: WappalyzerCategory[];
}

interface WappalyzerResult {
  urls: Record<string, { status: number }>;
  applications: WappalyzerApp[];
  meta: { language: string };
}

export class SimpleWappalyzerAdapter implements TechStackPort {
  async analyze(target: string): Promise<TechStackEntity> {
    let server: string | null = null;
    const technologies: string[] = [];
    let headers: Record<string, string> = {};

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      const response = await page.goto(target, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      if (!response) {
        throw new Error("No response from target");
      }

      const html = await page.content();
      const statusCode = response.status();
      const headersMap = response.headers();

      headers = headersMap;

      const result = (await wappalyzer({
        url: target,
        html,
        statusCode,
        headers: headersMap,
      })) as WappalyzerResult;

      if (Array.isArray(result)) {
        const applications = result as unknown as WappalyzerApp[];

        applications.forEach((app: WappalyzerApp) => {
          technologies.push(app.name);

          if (app.categories) {
            const categories = app.categories;
            const isWebServer = categories.some(
              (cat: WappalyzerCategory) => cat.id === 22
            );

            if (isWebServer && !server) {
              server = app.name;
            }
          }
        });
      } else if (
        result &&
        result.applications &&
        Array.isArray(result.applications)
      ) {
        result.applications.forEach((app: WappalyzerApp) => {
          technologies.push(app.name);

          if (app.categories) {
            const categories = app.categories;
            const isWebServer = categories.some(
              (cat: WappalyzerCategory) => cat.id === 22
            );

            if (isWebServer && !server) {
              server = app.name;
            }
          }
        });
      }

      if (!server && headers["server"]) {
        server = headers["server"];
      }
    } catch (error) {
      console.error("SimpleWappalyzer analysis failed:", error);
    } finally {
      await browser.close();
    }

    return new TechStackEntity(server, technologies, headers);
  }
}
