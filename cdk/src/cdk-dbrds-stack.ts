
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IGrantable } from 'aws-cdk-lib/aws-iam';

export interface CdkDbRdsStackProps extends StackProps {
    dbAccessItems?: IGrantable[];
}

export class CdkDbRdsStack extends Stack {
    constructor(scope: Construct, id: string, props?: CdkDbRdsStackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, "AuroraVpc");

        const cluster = new rds.ServerlessCluster(this, "AuroraDb", {
            engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
            parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, "ParameterGroup", "default.aurora-postgresql10"),
            defaultDatabaseName: "TestDb",
            vpc: vpc,
            scaling: {
                autoPause: cdk.Duration.seconds(0)
            }
        });

        for (let dbAccessItem of props?.dbAccessItems || []) {
            cluster.grantDataApiAccess(dbAccessItem);
        }

    }
}
