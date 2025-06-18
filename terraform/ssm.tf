
resource "aws_ssm_parameter" "feedly_token" {
  name  = local.ssm_parameter_feedly
  type  = "String"
  value = var.feedly_token

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "raindrop_token" {
  name  = local.ssm_parameter_raindrop
  type  = "String"
  value = var.raindrop_token

  lifecycle {
    ignore_changes = [value]
  }
}
