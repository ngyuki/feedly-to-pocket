
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-1"

  default_tags {
    tags = {
      Project   = local.project
      ManagedBy = "terraform"
    }
  }
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  project                = "feedly-to-raindrop"
  lambda_memory_size     = 256
  lambda_timeout         = 30
  log_retention_days     = 1
  schedule_expression    = "rate(10 minutes)"
  ssm_parameter_feedly   = "/feedly-to-raindrop/feedly-token"
  ssm_parameter_raindrop = "/feedly-to-raindrop/raindrop-token"
  lambda_code_path       = "${path.root}/../dist/main.js"
  lambda_zip_path        = "${path.root}/../dist/main.zip"
}
