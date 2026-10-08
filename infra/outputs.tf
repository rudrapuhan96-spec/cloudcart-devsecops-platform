output "vpc_id" {
  description = "CloudCart VPC ID"
  value       = aws_vpc.main.id
}

output "availability_zones" {
  description = "Availability Zones used by CloudCart"
  value       = local.azs
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "app_subnet_ids" {
  description = "Private application subnet IDs"
  value       = aws_subnet.app[*].id
}

output "database_subnet_ids" {
  description = "Private database subnet IDs"
  value       = aws_subnet.database[*].id
}

output "nat_gateway_ids" {
  description = "NAT Gateway IDs"
  value       = aws_nat_gateway.main[*].id
}

output "public_route_table_id" {
  description = "Public route table ID"
  value       = aws_route_table.public.id
}

output "app_route_table_ids" {
  description = "Private application route table IDs"
  value       = aws_route_table.app[*].id
}

output "database_route_table_id" {
  description = "Private database route table ID"
  value       = aws_route_table.database.id
}
