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
  default     = "t3.medium" # t3.medium provides 2 vCPUs and 4GB RAM, which is more stable for running Kubernetes, microservices and monitoring.
}

variable "ssh_key_name" {
  description = "The name of the pre-configured AWS EC2 Key Pair used for SSH authentication"
  type        = string
  default     = "chaima"
}
