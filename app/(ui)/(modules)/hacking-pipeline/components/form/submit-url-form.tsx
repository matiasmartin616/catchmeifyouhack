"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Terminal, ShieldAlert, Loader2 } from "lucide-react";

import { useLaunchService } from "../../data-layer/service-hooks/use-launch.service.hook";
import { LaunchRequest } from "@/app/api/hacking-pipeline/domain/dtos";

const formSchema = z.object({
    url: z.string()
        .min(1, "ERROR: TARGET_UNDEFINED // INPUT_REQUIRED")
        .transform((val) => {
            if (val && !val.startsWith('http://') && !val.startsWith('https://')) {
                return `https://${val}`;
            }
            return val;
        })
        .pipe(z.url("ERROR: INVALID_TARGET_SYNTAX // PROTOCOL_MISMATCH"))
        .refine((val) => {
            try {
                const url = new URL(val);
                return url.hostname.includes('.');
            } catch {
                return false;
            }
        }, "ERROR: INVALID_DOMAIN // TOP_LEVEL_DOMAIN_REQUIRED"),
});

type FormData = z.infer<typeof formSchema>;

interface SubmitUrlFormProps {
    onLaunchSuccess?: (pipelineId: string) => void;
}

export default function SubmitUrlForm({ onLaunchSuccess }: SubmitUrlFormProps) {
    const {
        launch,
        isPending: isSubmitting,
        isSuccess: isLaunchSuccess,
        isError: isLaunchError
    } = useLaunchService({
        successCallback: (data) => {
            if (data.pipelineId) {
                onLaunchSuccess?.(data.pipelineId);
            }
        }
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: FormData) => {
        const launchRequest = new LaunchRequest(data.url);
        launch(launchRequest);
    };

    return (
        <div className="w-full max-w-md p-6 bg-black border border-green-500/30 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.1)] font-mono">
            <div className="flex items-center gap-2 mb-6 text-green-500 border-b border-green-500/20 pb-2">
                <Terminal size={20} />
                <span className="text-sm font-bold tracking-widest uppercase">Target_Infiltration_Console</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                    <label className="block text-xs text-green-500/70 mb-1 uppercase tracking-tighter">
                        [+] Enter_Target_URL
                    </label>
                    <div className="relative">
                        <input
                            {...register("url")}
                            type="text"
                            autoComplete="off"
                            spellCheck="false"
                            placeholder="https://target-system.com"
                            className="w-full bg-zinc-900 border border-green-500/50 rounded p-3 text-green-400 placeholder:text-green-900 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all text-sm"
                        />
                        {errors.url && (
                            <p className="mt-1 text-[10px] text-red-500 flex items-center gap-1 uppercase font-bold">
                                <ShieldAlert size={10} /> {errors.url.message}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isLaunchSuccess}
                    className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold py-3 px-4 rounded transition-colors flex items-center justify-center gap-2 uppercase text-xs tracking-widest active:scale-[0.98]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="animate-spin" size={16} />
                            Bypassing_Firewall...
                        </>
                    ) : isLaunchSuccess ? (
                        "Intercepting_Data..."
                    ) : (
                        "Execute_Attack_Sequence"
                    )}
                </button>
            </form>

            {(isLaunchSuccess || isLaunchError) && (
                <div className={`mt-6 p-3 border rounded text-[10px] uppercase font-bold ${isLaunchSuccess ? 'bg-green-950/30 border-green-500/50 text-green-400' : 'bg-red-950/30 border-red-500/50 text-red-400'
                    }`}>
                    <div className="flex items-start gap-2">
                        <span className="shrink-0">{isLaunchSuccess ? '>' : '!'}</span>
                        <p className="leading-relaxed">
                            {isLaunchSuccess
                                ? "Pipeline launched successfully. Intercepting data..."
                                : "Connection lost. Failed to penetrate target."}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-4 flex justify-between text-[8px] text-green-900 uppercase tracking-widest">
                <span>ENC: AES-256</span>
                <span>AUTH: GRANTED</span>
                <span>V-0.1.0</span>
            </div>
        </div>
    );
}
