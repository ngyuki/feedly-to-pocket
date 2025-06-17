output "lambda_main_function_name" {
  description = "Name of the main Lambda function"
  value       = aws_lambda_function.main.function_name
}

output "lambda_main_function_arn" {
  description = "ARN of the main Lambda function"
  value       = aws_lambda_function.main.arn
}

output "sns_topic_arn" {
  description = "ARN of the SNS topic for failure notifications"
  value       = aws_sns_topic.failure.arn
}

output "scheduler_schedule_name" {
  description = "Name of the EventBridge Schedule"
  value       = aws_scheduler_schedule.main.name
}

output "ssm_parameter_feedly_name" {
  description = "Name of the SSM parameter for Feedly token"
  value       = aws_ssm_parameter.feedly_token.name
}

output "ssm_parameter_raindrop_name" {
  description = "Name of the SSM parameter for Raindrop token"
  value       = aws_ssm_parameter.raindrop_token.name
}
