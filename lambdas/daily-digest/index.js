// Lambda — Daily Digest
// Triggered by EventBridge at 9:00 AM daily
// Scans tasks due today and sends digest emails via SNS

const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

exports.handler = async (event) => {
  // TODO: Scan for tasks due today, send digest emails
  console.log('Daily digest triggered', JSON.stringify(event));
};
