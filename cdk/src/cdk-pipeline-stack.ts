
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { SecretValue } from 'aws-cdk-lib';
import { PipelineStage } from './pipeline-stage';

export class CdkPipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'FullStackAppBuildDeployPipeline',
            synth: new CodeBuildStep("SynthStep", {
                input: CodePipelineSource.gitHub("aaronrcox/cdk-js-fullstack-boilerplate", "main", {
                    authentication: SecretValue.secretsManager("aaron-github-access-token")
                }),
                installCommands: [
                    'npm install -g npm',
                    'npm --version',
                    "node --version",
                    // 'npm install -g aws-cdk',
                    // 'npm install -g @angular/cli',
                    // 'npm install -g @nestjs/cli'
                ],
                commands: [
                    'npm ci',
                    'npm run build --workspaces',
                    'npx cdk synth'
                ]
            })
        });

        const deploy = new PipelineStage(this, "Deploy");
        pipeline.addStage(deploy);

    }
}