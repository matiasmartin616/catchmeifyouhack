import { LaunchRequest, LaunchResponse } from "../domain/dtos/index";

import HackingPipelineInstance, {
  HackingPipelineStatus,
  HackingPipelineResultKey,
} from "../domain/entities/hacking-pipeline-instance";
import { hackingPipelineInstanceStore } from "../infra/store/hacking-pipeline-instance.store";
import { reconModule, ReconModule } from "../(modules)/2-recon/2-recon.module";
import { reportingModule } from "../(modules)/reporting/reporting.module";
import { ReportingModuleInterface } from "../(modules)/reporting/reporting.module.i";
export interface HackingPipelineServiceInterface {
  launch(request: LaunchRequest): Promise<LaunchResponse>;
  getPipelineInstanceById(id: string): HackingPipelineInstance | undefined;
  generateReportByInstanceId(instanceId: string): Promise<Buffer>;
}

export class HackingPipelineService implements HackingPipelineServiceInterface {
  constructor(
    private readonly reconModule: ReconModule,
    private readonly reportingModule: ReportingModuleInterface
  ) {}

  async launch(request: LaunchRequest): Promise<LaunchResponse> {
    const hackingPipelineInstance = new HackingPipelineInstance(
      crypto.randomUUID(),
      HackingPipelineStatus.PENDING,
      request.url,
      {},
      new Date(),
      new Date()
    );

    const pipelineId = hackingPipelineInstanceStore.create(
      hackingPipelineInstance
    );

    // Fire and forget - simple orchestration
    this.runPipeline(hackingPipelineInstance).catch((err) => {
      console.error(err);
      console.error(`Pipeline ${pipelineId} failed:`, err);
      hackingPipelineInstance.updateStatus(HackingPipelineStatus.FAILED);
      hackingPipelineInstanceStore.update(hackingPipelineInstance);
    });

    return new LaunchResponse(pipelineId.toString());
  }

  private async runPipeline(instance: HackingPipelineInstance) {
    try {
      // 1. SCOPING (Skipped/Mocked for now as per strict 48h deadline)
      instance.updateStatus(HackingPipelineStatus.SCOPING);
      hackingPipelineInstanceStore.update(instance);

      // 2. RECON
      instance.updateStatus(HackingPipelineStatus.RECON);
      hackingPipelineInstanceStore.update(instance);

      const reconResult = await this.reconModule.runRecon(instance.targetUrl);
      instance.addResult(HackingPipelineResultKey.RECON, reconResult);
      hackingPipelineInstanceStore.update(instance);

      // Mark as completed for now as requested ("48 hours", "simple")
      instance.updateStatus(HackingPipelineStatus.COMPLETED);
      hackingPipelineInstanceStore.update(instance);
    } catch (error) {
      console.error("Pipeline execution error:", error);
      instance.updateStatus(HackingPipelineStatus.FAILED);
      hackingPipelineInstanceStore.update(instance);
    }
  }

  getPipelineInstanceById(id: string): HackingPipelineInstance | undefined {
    return hackingPipelineInstanceStore.getById(id);
  }

  async generateReportByInstanceId(instanceId: string): Promise<Buffer> {
    const instance = this.getPipelineInstanceById(instanceId);
    if (!instance) {
      throw new Error("Pipeline instance not found");
    }
    return await this.reportingModule.generateReport(instance);
  }
}

export const hackingPipelineService = new HackingPipelineService(
  reconModule,
  reportingModule
);
