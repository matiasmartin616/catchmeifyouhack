"use client";

import { use } from "react";
import AttackStatusDashboard from "../../../(modules)/hacking-pipeline/components/status/attack-status-dashboard";

export default function PipelinePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <div className="w-full flex justify-center">
            <AttackStatusDashboard pipelineId={id} />
        </div>
    );
}

