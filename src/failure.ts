import aws from 'aws-sdk'

const sns = new aws.SNS();

export async function handler(event: any) {
    await sns.publish({
        TargetArn: process.env.SNS_TOPIC_ARN,
        Message: JSON.stringify(event.responsePayload, null, 2),
    }).promise();
}
