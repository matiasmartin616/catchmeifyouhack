import { NextRequest, NextResponse } from "next/server";
import { hackingPipelineModule } from "../../hacking-pipeline.module";
import {
  LaunchRequest,
  LaunchResponse,
  LaunchResponseDTO,
} from "../../domain/dtos";
import { z } from "zod";

const launchSchema = z.object({
  url: z.preprocess(
    (val) => {
      if (typeof val === "string" && !/^https?:\/\//i.test(val)) {
        return `https://${val}`;
      }
      return val;
    },
    z.url({ message: "Invalid URL format" }).refine(
      (url) => {
        try {
          const parsed = new URL(url);
          return ["http:", "https:"].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: "Must be HTTP/HTTPS protocol" }
    )
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = launchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: validation.error.format().url?._errors[0] || "Invalid request",
        },
        { status: 400 }
      );
    }

    const launchRequest = new LaunchRequest(validation.data.url);

    const result: LaunchResponseDTO = await hackingPipelineModule.launch(
      launchRequest
    );
    return NextResponse.json(result);
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";
    console.log(message);
    return NextResponse.json(new LaunchResponse(undefined, message), {
      status: 500,
    });
  }
}
