variable "aws_region" {
  description = "AWS region where CloudCart infrastructure is deployed"
  type        = string
  default     = "ap-south-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the CloudCart VPC"
  type        = string
  default     = "10.20.0.0/16"
}

variable "project_name" {
  description = "Project name used in resource naming"
  type        = string
  default     = "CloudCart"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}
