
resource "aws_scheduler_schedule" "main" {
  name                = "${local.project}-schedule"
  schedule_expression = local.schedule_expression

  flexible_time_window {
    mode = "OFF"
  }

  target {
    arn      = aws_lambda_function.main.arn
    role_arn = aws_iam_role.scheduler.arn
  }
}
