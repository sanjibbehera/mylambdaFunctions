import boto3

ec2 = boto3.client('ec2')


def start_ec2_instances(event, context):
    ec2_instances = get_all_stopped_ec2_ids()
    response = ec2.start_instances(
        InstanceIds=ec2_instances,
        DryRun=False
    )
    return response

def stop_ec2_instances(event, context):
    ec2_instances = get_all_started_ec2_ids()
    response = ec2.stop_instances(
        InstanceIds=ec2_instances,
        DryRun=False
    )
    return response


def get_all_stopped_ec2_ids():
    resp = ec2.describe_instances(DryRun=False)
    instances = []
    for reservation in resp["Reservations"]:
        for inst in reservation["Instances"]:
            if inst["State"]["Name"] == 'stopped':
                instances.append(inst["InstanceId"])
    return instances

def get_all_started_ec2_ids():
    resp = ec2.describe_instances(DryRun=False)
    instances = []
    for reservation in resp["Reservations"]:
        for inst in reservation["Instances"]:
            if inst["State"]["Name"] == 'running':
                instances.append(inst["InstanceId"])
    return instances