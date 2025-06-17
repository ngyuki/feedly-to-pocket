
variable "notify_failure_email" {
  description = "Email address for failure notifications"
  type        = string
}

variable "feedly_client_id" {
  description = "Feedly API client ID"
  type        = string
  sensitive   = true
}

variable "feedly_client_secret" {
  description = "Feedly API client secret"
  type        = string
  sensitive   = true
}

variable "raindrop_client_id" {
  description = "Raindrop.io API client ID"
  type        = string
  sensitive   = true
}

variable "raindrop_client_secret" {
  description = "Raindrop.io API client secret"
  type        = string
  sensitive   = true
}

variable "feedly_token" {
  description = "Feedly API token"
  type        = string
  sensitive   = true
}

variable "raindrop_token" {
  description = "Raindrop.io API token"
  type        = string
  sensitive   = true
}
