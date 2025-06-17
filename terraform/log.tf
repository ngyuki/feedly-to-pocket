
resource "aws_cloudwatch_log_group" "main" {
  name              = "/aws/lambda/${local.project}"
  retention_in_days = local.log_retention_days
}
