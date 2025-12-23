"use client";

import { useState } from "react";
import SubmitUrlForm from "./form/submit-url-form";
import AttackStatusDashboard from "./status/attack-status-dashboard";

export default function PipelineManager() {
    const [pipelineId, setPipelineId] = useState<string | null>(null);

    if (pipelineId) {
        return <AttackStatusDashboard pipelineId={pipelineId} />;
    }

    return <SubmitUrlForm onLaunchSuccess={setPipelineId} />;
}

