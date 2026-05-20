variable "aws_region" {
  description = "AWS region to deploy resources into"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Target deployment environment (e.g., development, production)"
  type        = string
  default     = "production"
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "suivi-depenses"
}

variable "instance_type" {
  description = "EC2 instance size"
  type        = string
  default     = "t3.small" # 2 vCPUs, 2GB RAM is optimal for building and running Spring Boot + Angular + MySQL.
}

variable "ssh_key_name" {
  description = "The name of the pre-configured AWS EC2 Key Pair used for SSH authentication"
  type        = string
  default     = "suivi-depenses-key"
}
