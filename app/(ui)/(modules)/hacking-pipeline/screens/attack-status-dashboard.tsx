"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Terminal,
    Shield,
    Cpu,
    Activity,
    Lock,
    Wifi,
    Server,
    Globe,
    CheckCircle2,
    XCircle,
    AlertTriangle,
} from "lucide-react";
import { useStatusService } from "../data-layer/service-hooks/use-status.service.hook";
import { useDownloadReportByPipelineId } from "../data-layer/service-hooks/use-download-report-by-pipeline-id.hook";
import { HackingPipelineStatus } from "@/app/api/hacking-pipeline/domain/entities/hacking-pipeline-instance";

interface AttackStatusDashboardProps {
    pipelineId: string;
}

const STATUS_PROGRESS: Record<HackingPipelineStatus, number> = {
    [HackingPipelineStatus.PENDING]: 5,
    [HackingPipelineStatus.LAUNCHED]: 10,
    [HackingPipelineStatus.SCOPING]: 25,
    [HackingPipelineStatus.RECON]: 40,
    [HackingPipelineStatus.SCANNING]: 60,
    [HackingPipelineStatus.VULN_ANALYSIS]: 80,
    [HackingPipelineStatus.EXPLOITING]: 86,
    [HackingPipelineStatus.POST_EXPLOITING]: 90,
    [HackingPipelineStatus.COMPLETED]: 100,
    [HackingPipelineStatus.FAILED]: 0,
};

const STATUS_SEQUENCE = [
    HackingPipelineStatus.PENDING,
    HackingPipelineStatus.LAUNCHED,
    HackingPipelineStatus.SCOPING,
    HackingPipelineStatus.RECON,
    HackingPipelineStatus.SCANNING,
    HackingPipelineStatus.VULN_ANALYSIS,
    HackingPipelineStatus.EXPLOITING,
    HackingPipelineStatus.POST_EXPLOITING,
    HackingPipelineStatus.COMPLETED,
];

const STATUS_MESSAGES: Record<HackingPipelineStatus, string> = {
    [HackingPipelineStatus.PENDING]: "INITIALIZING_SYSTEM_RESOURCES...",
    [HackingPipelineStatus.LAUNCHED]: "TARGET_ACQUIRED. LAUNCHING_MODULES...",
    [HackingPipelineStatus.SCOPING]: "DEFINING_ATTACK_SURFACE // ANALYZING_SCOPE...",
    [HackingPipelineStatus.RECON]: "ENUMERATING_TARGET_INFO...",
    [HackingPipelineStatus.SCANNING]: "ENUMERATING_SERVICES // PORT_SCANNING_IN_PROGRESS...",
    [HackingPipelineStatus.VULN_ANALYSIS]: "ANALYZING_VULNERABILITIES...",
    [HackingPipelineStatus.EXPLOITING]: "VULNERABILITY_DETECTED // ATTEMPTING_EXPLOIT...",
    [HackingPipelineStatus.POST_EXPLOITING]: "ACCESS_GRANTED // GATHERING_INTELLIGENCE...",
    [HackingPipelineStatus.COMPLETED]: "OPERATION_SUCCESSFUL // REPORT_GENERATED.",
    [HackingPipelineStatus.FAILED]: "CONNECTION_LOST // OPERATION_ABORTED.",
};

export default function AttackStatusDashboard({
    pipelineId,
}: AttackStatusDashboardProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const router = useRouter();

    const { data: statusResponse, isError } = useStatusService({
        pipelineId,
    });

    const {
        data: reportBlob,
        isLoading: isDownloadingReport,
        refetch: downloadReport,
    } = useDownloadReportByPipelineId(pipelineId);

    const info = statusResponse?.pipelineInstanceInfo;
    const currentStatus = (info?.status as HackingPipelineStatus) || HackingPipelineStatus.PENDING;
    const isComplete = currentStatus === HackingPipelineStatus.COMPLETED;
    const isFailed = currentStatus === HackingPipelineStatus.FAILED;

    const vulnResults = info?.results?.["vuln_analysis"] as unknown as { vulnerabilities: { severity: string }[] };
    const totalVulns = vulnResults?.vulnerabilities?.length || 0;
    const criticalVulns = vulnResults?.vulnerabilities?.filter((v) => v.severity === "CRITICAL").length || 0;
    const highVulns = vulnResults?.vulnerabilities?.filter((v) => v.severity === "HIGH").length || 0;

    useEffect(() => {
        if (isError) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isError, router]);

    const logs = useMemo(() => {
        if (isError) {
            return [
                "ERROR: CONNECTION_LOST",
                "STATUS: TARGET_NOT_FOUND_OR_UNREACHABLE",
                "ACTION: RETRYING_CONNECTION (3/3) - FAILED",
                "SYSTEM: ABORTING_OPERATION...",
                "REDIRECTING: RETURNING_TO_HOME_SCREEN..."
            ];
        }
        if (!info) return [];

        const logsList: string[] = [];
        const currentIdx = STATUS_SEQUENCE.indexOf(currentStatus);

        if (currentIdx === -1 && currentStatus !== HackingPipelineStatus.FAILED) {
            return [`Unknown status: ${currentStatus}`];
        }

        if (currentStatus === HackingPipelineStatus.FAILED) {
            logsList.push(`[${new Date(info.createdAt).toLocaleTimeString()}] > ${HackingPipelineStatus.PENDING} :: ${STATUS_MESSAGES[HackingPipelineStatus.PENDING]}`);
            logsList.push(`[${new Date(info.updatedAt).toLocaleTimeString()}] > ${HackingPipelineStatus.FAILED} :: ${STATUS_MESSAGES[HackingPipelineStatus.FAILED]}`);
            return logsList;
        }

        for (let i = 0; i <= currentIdx; i++) {
            const status = STATUS_SEQUENCE[i];
            logsList.push(`[CHECK] > ${status} :: ${STATUS_MESSAGES[status]}`);
        }

        return logsList;
    }, [info, currentStatus, isError]);

    useEffect(() => {
        if (!info?.createdAt) return;

        const interval = setInterval(() => {
            const start = new Date(info.createdAt).getTime();
            const now = new Date().getTime();
            setElapsedTime(Math.floor((now - start) / 1000));
        }, 1000);

        if (isComplete || isFailed) clearInterval(interval);
        return () => clearInterval(interval);
    }, [info?.createdAt, isComplete, isFailed]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    const progress = STATUS_PROGRESS[currentStatus];

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleDownloadReport = () => {
        if (!pipelineId) return;
        downloadReport();
    };

    useEffect(() => {
        if (reportBlob) {
            const url = window.URL.createObjectURL(reportBlob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `report-${pipelineId}.pdf`);
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
            window.URL.revokeObjectURL(url);
        }
    }, [reportBlob, pipelineId]);

    return (
        <div className="w-full max-w-5xl p-2 md:p-1 font-mono">
            <div className="relative bg-black border border-green-500/30 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b border-green-500/20 bg-green-950/10 backdrop-blur-sm gap-2 md:gap-0">
                    <div className="flex items-center gap-3">
                        <Terminal className="text-green-500" size={18} />
                        <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-green-400 uppercase">
                            CatchMeIfYouHack_Console{" "}
                            <span className="text-green-700">{"//"}</span> v1.0
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-green-600 w-full md:w-auto justify-between md:justify-start">
                        <span className="flex items-center gap-2">
                            <Wifi
                                size={12}
                                className={isError ? "text-red-500" : "animate-pulse"}
                            />
                            {isError ? "CONN_ERR" : "CONN_STABLE"}
                        </span>
                        <span className="flex items-center gap-2">
                            <Activity size={12} />
                            {formatTime(elapsedTime)}
                        </span>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-6">
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-zinc-900/50 border border-green-500/20 p-4 rounded">
                            <h3 className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest mb-4">
                                <Globe size={14} /> Target_Info
                            </h3>
                            <div className="space-y-3 text-xs">
                                <div className="group">
                                    <span className="block text-green-800 text-[10px] uppercase">
                                        Target_URL
                                    </span>
                                    <span className="text-green-300 break-all">
                                        {info?.targetUrl || "LOADING..."}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-green-800 text-[10px] uppercase">
                                        Session_ID
                                    </span>
                                    <span className="text-green-600 font-mono text-[10px]">
                                        {pipelineId.substring(0, 18)}...
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/50 border border-green-500/20 p-4 rounded">
                            <h3 className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest mb-4">
                                <Cpu size={14} /> Current_Phase
                            </h3>
                            <div className="flex flex-col items-center py-4 gap-2">
                                {isComplete ? (
                                    <CheckCircle2 size={48} className="text-green-500" />
                                ) : isFailed ? (
                                    <XCircle size={48} className="text-red-500" />
                                ) : (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 animate-pulse" />
                                        <Shield
                                            size={48}
                                            className="text-green-500 relative z-10 animate-pulse"
                                        />
                                    </div>
                                )}
                                <span
                                    className={`text-lg font-black tracking-widest uppercase mt-2 ${isFailed ? "text-red-500" : "text-green-400"
                                        }`}
                                >
                                    {currentStatus}
                                </span>
                            </div>
                        </div>

                        {/* VULN STATS */}
                        {(totalVulns > 0 || currentStatus === HackingPipelineStatus.COMPLETED) && (
                            <div className="bg-zinc-900/50 border border-green-500/20 p-4 rounded animate-in fade-in zoom-in duration-500">
                                <h3 className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest mb-4">
                                    <AlertTriangle size={14} /> Possible_Vuln_Detected
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-red-500 font-bold uppercase">Critical</span>
                                        <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded border border-red-500/50">
                                            {criticalVulns}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-orange-500 font-bold uppercase">High</span>
                                        <span className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded border border-orange-500/50">
                                            {highVulns}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pt-2 border-t border-green-500/10">
                                        <span className="text-green-600 font-bold uppercase">Total</span>
                                        <span className="text-green-400 font-mono">
                                            {totalVulns}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 flex flex-col h-[300px] md:h-[400px]">
                        <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-[10px] text-green-700 uppercase tracking-widest font-bold">
                                {"// System_Logs"}
                            </span>
                            <span className="text-[10px] text-green-900 uppercase">
                                /var/log/attack_pipeline.log
                            </span>
                        </div>

                        <div
                            ref={scrollRef}
                            className="flex-1 bg-black/80 border border-green-500/20 rounded p-4 overflow-y-auto font-mono text-xs space-y-1 scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-transparent"
                        >
                            {!info && !isError && (
                                <div className="text-green-900 animate-pulse">
                                    ESTABLISHING_UPLINK... (RETRYING_CONNECTION)
                                </div>
                            )}
                            {logs.map((log, i) => (
                                <div
                                    key={i}
                                    className={`border-l-2 pl-2 transition-colors ${isError
                                        ? "text-red-500/80 border-red-900/50 hover:bg-red-900/10"
                                        : "text-green-500/80 border-green-900/50 hover:bg-green-900/10"
                                        }`}
                                >
                                    <span className={isError ? "text-red-700 mr-2" : "text-green-700 mr-2"}>$</span>
                                    {log}
                                </div>
                            ))}
                            <div className={`animate-pulse ${isError ? "text-red-500" : "text-green-500"}`}>_</div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between text-[10px] text-green-600 mb-1 uppercase tracking-widest font-bold">
                                <span>Infiltration_Progress</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-green-950/50 rounded-full overflow-hidden border border-green-900/30">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out ${isFailed ? "bg-red-600" : "bg-green-500"
                                        }`}
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3))] bg-size-[10px_10px] animate-[progress_1s_linear_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-2 border-t border-green-500/20 bg-black/50 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center text-[8px] uppercase tracking-[0.2em] text-green-800">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1">
                            <Lock size={8} /> ENCRYPTED
                        </span>
                        <span className="flex items-center gap-1">
                            <Server size={8} /> NODE_01
                        </span>
                    </div>
                    {isComplete && (
                        <button
                            onClick={handleDownloadReport}
                            disabled={isDownloadingReport}
                            className={`bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 md:py-1 rounded text-[10px] transition-colors cursor-pointer w-full md:w-auto ${isDownloadingReport ? "opacity-50 cursor-wait" : ""
                                }`}
                        >
                            {isDownloadingReport ? "DOWNLOADING..." : "DOWNLOAD_REPORT"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
