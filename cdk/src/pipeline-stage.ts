
import { CdkFrontendStack } from "./cdk-frontend-stack";
import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkBackendStack } from "./cdk-backend-stack";
import { CdkDbRdsStack } from "./cdk-dbrds-stack";

export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props?: StageProps) {
        super(scope, id, props);

        const frontend = new CdkFrontendStack(this, 'FrondendApp');
        const backend = new CdkBackendStack(this, "BackendApi");
        const db = new CdkDbRdsStack(this, "Aurora", {
            dbAccessItems: [
                backend.backendHandler
            ]
        });

    }
}