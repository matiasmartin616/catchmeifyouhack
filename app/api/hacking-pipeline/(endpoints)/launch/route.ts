import { NextRequest, NextResponse } from "next/server";
import { hackingPipelineModule } from "../../hacking-pipeline.module";
import { LaunchRequest, LaunchResponse } from "../../domain/dtos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const launchRequest = new LaunchRequest(body.url);

    const result = await hackingPipelineModule.launch(launchRequest);
    return NextResponse.json(result);
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";
    console.log(message);
    return NextResponse.json(new LaunchResponse(undefined), {
      status: 500,
    });
  }
}
