import * as cdk from '@aws-cdk/core';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_s3, aws_s3_deployment } from 'aws-cdk-lib';

export class CdkFrontendStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// S3 Bucket
		// Host the static files for the angular app
		// --------------------------------------------------------------------
		const bucket = new aws_s3.Bucket(this, "FullStackAppFrontend", {
			publicReadAccess: true,
			websiteIndexDocument: 'index.html',
			removalPolicy: cdk.RemovalPolicy.DESTROY
		});

		// Deployment:
		// Copy the angular app dist/frontend folder to the s3 bucket above
		// --------------------------------------------------------------------
		new aws_s3_deployment.BucketDeployment(this, 'FullStackAppFrontendDeployment', {
			sources: [
				aws_s3_deployment.Source.asset('./frontend/dist/frontend')
			],
			destinationBucket: bucket
		})
		// --------------------------------------------------------------------
	}
}
