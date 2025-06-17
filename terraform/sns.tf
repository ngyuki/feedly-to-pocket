resource "aws_sns_topic" "failure" {
  name         = "${local.project}-failure"
  display_name = "FAILURE ${local.project}"
}

resource "aws_sns_topic_subscription" "failure_email" {
  topic_arn = aws_sns_topic.failure.arn
  protocol  = "email"
  endpoint  = var.notify_failure_email
}
