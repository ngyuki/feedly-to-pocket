
resource "terraform_data" "pack" {
  input = {
    filename = local.lambda_zip_path
  }

  provisioner "local-exec" {
    command     = "npm ci && npm run build:lambda"
    working_dir = "${path.module}/.."
  }
}

resource "aws_lambda_function" "main" {
  function_name = local.project
  role          = aws_iam_role.lambda.arn
  handler       = "dist/main.handler"
  runtime       = "nodejs20.x"
  memory_size   = local.lambda_memory_size
  timeout       = local.lambda_timeout
  filename      = terraform_data.pack.output.filename

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
