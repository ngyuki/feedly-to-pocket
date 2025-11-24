
data "archive_file" "pack" {
  type        = "zip"
  source_file = local.lambda_code_path
  output_path = local.lambda_zip_path
}

resource "aws_lambda_function" "main" {
  function_name    = local.project
  role             = aws_iam_role.lambda.arn
  handler          = "dist/main.handler"
  runtime          = "nodejs22.x"
  memory_size      = local.lambda_memory_size
  timeout          = local.lambda_timeout
  filename         = data.archive_file.pack.output_path
  source_code_hash = data.archive_file.pack.output_base64sha256

  environment {
    variables = {
      SSM_PARAMETER_FEEDLY   = local.ssm_parameter_feedly
      SSM_PARAMETER_RAINDROP = local.ssm_parameter_raindrop
      FEEDLY_CLIENT_ID       = var.feedly_client_id
      FEEDLY_CLIENT_SECRET   = var.feedly_client_secret
      RAINDROP_CLIENT_ID     = var.raindrop_client_id
      RAINDROP_CLIENT_SECRET = var.raindrop_client_secret
    }
  }

  dead_letter_config {
    target_arn = aws_sns_topic.failure.arn
  }

  logging_config {
    log_format = "Text"
    log_group  = aws_cloudwatch_log_group.main.name
  }
}
