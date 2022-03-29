
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IGrantable } from 'aws-cdk-lib/aws-iam';
import { ServerlessCluster } from 'aws-cdk-lib/aws-rds';
import { Ec2TaskDefinition } from 'aws-cdk-lib/aws-ecs';


export class CdkDbRdsStack extends Stack {

    private cluster: rds.ServerlessCluster;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, "AuroraVpc");

        const bastion = new ec2.BastionHostLinux(this, 'BastionHost', {
            vpc,
            subnetSelection: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            blockDevices: [{
                deviceName: 'EBSBastionHost',
                volume: ec2.BlockDeviceVolume.ebs(10, {
                    encrypted: true
                })
            }]
        })

        bastion.connections.allowDefaultPortFromAnyIpv4();

        this.cluster = new rds.ServerlessCluster(this, "AuroraDb", {
            engine: rds.DatabaseClusterEngine.AURORA_POSTGRESQL,
            parameterGroup: rds.ParameterGroup.fromParameterGroupName(this, "ParameterGroup", "default.aurora-postgresql10"),
            defaultDatabaseName: "TestDb",
            enableDataApi: true,
            vpc: vpc,
            scaling: {
                autoPause: cdk.Duration.minutes(5),
                minCapacity: cdk.aws_rds.AuroraCapacityUnit.ACU_2
            },


        });

    }

    grantAccess(granter: IGrantable) {
        this.cluster.grantDataApiAccess(granter);
    }

}
