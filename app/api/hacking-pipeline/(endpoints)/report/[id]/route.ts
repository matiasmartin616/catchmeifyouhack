import { NextRequest, NextResponse } from "next/server";
import { hackingPipelineModule } from "../../../hacking-pipeline.module";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const pdfBuffer = await hackingPipelineModule.generateReport(id);

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);

    if (
      error instanceof Error &&
      error.message === "Hacking pipeline instance not found"
    ) {
      return NextResponse.json(
        { error: "Hacking pipeline instance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
