import { NextRequest, NextResponse } from "next/server";
import { hackingPipelineModule } from "../../../hacking-pipeline.module";
import {
  StatusRequest,
  StatusResponse,
  StatusResponseDTO,
} from "../../../domain/dtos";
import HackingPipelineInstance, {
  HackingPipelineStatus,
} from "../../../domain/entities/hacking-pipeline-instance";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.uuid(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const validation = paramsSchema.safeParse({ id });
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    if (!id) {
      return NextResponse.json(
        new StatusResponse(
          new HackingPipelineInstance(
            id,
            HackingPipelineStatus.EXPLOITING,
            "",
            {},
            new Date(),
            new Date()
          )
        )
      );
    }
    const result = await hackingPipelineModule.status(new StatusRequest(id));

    let displayInstance = result.pipelineInstanceInfo;

    try {
      const url = new URL(result.pipelineInstanceInfo.targetUrl);
      displayInstance = new HackingPipelineInstance(
        displayInstance.pipelineId,
        displayInstance.status,
        url.hostname,
        displayInstance.results,
        displayInstance.createdAt,
        displayInstance.updatedAt
      );
    } catch {
      // If invalid URL, keep original
    }

    return NextResponse.json<StatusResponseDTO>(
      new StatusResponse(displayInstance)
    );
  } catch (reason: unknown) {
    console.error(reason);

    if (
      reason instanceof Error &&
      reason.message === "Hacking pipeline instance not found"
    ) {
      return NextResponse.json(
        { error: "Hacking pipeline instance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<StatusResponseDTO>(
      new StatusResponse(
        new HackingPipelineInstance(
          "",
          HackingPipelineStatus.PENDING,
          "",
          {},
          new Date(),
          new Date()
        )
      ),
      { status: 500 }
    );
  }
}
