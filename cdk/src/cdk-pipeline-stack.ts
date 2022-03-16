
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { SecretValue } from 'aws-cdk-lib';

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
                    'npm install -g aws-cdk'
                ],
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
            })
        });

    }
}