import { NextRequest, NextResponse } from "next/server";
import { hackingPipelineModule } from "../../../hacking-pipeline.module";
import { StatusRequest, StatusResponse } from "../../../domain/dtos";
import HackingPipelineInstance, {
  HackingPipelineStatus,
} from "../../../domain/entities/hacking-pipeline-instance";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(id);
    if (!id) {
      return NextResponse.json(
        new StatusResponse(
          new HackingPipelineInstance(
            id,
            HackingPipelineStatus.EXPLOITING,
            "",
            new Map(),
            new Date(),
            new Date()
          )
        )
      );
    }
    const result = await hackingPipelineModule.status(new StatusRequest(id));
    return NextResponse.json(result);
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";

    return NextResponse.json(
      new StatusResponse(
        new HackingPipelineInstance(
          "",
          HackingPipelineStatus.PENDING,
          "",
          new Map(),
          new Date(),
          new Date()
        )
      ),
      { status: 500 }
    );
  }
}
