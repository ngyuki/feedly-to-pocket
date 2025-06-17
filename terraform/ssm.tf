
resource "aws_ssm_parameter" "feedly_token" {
  name  = local.ssm_parameter_feedly
  type  = "String"
  value = var.feedly_token
}

resource "aws_ssm_parameter" "raindrop_token" {
  name  = local.ssm_parameter_raindrop
  type  = "String"
  value = var.raindrop_token
}
