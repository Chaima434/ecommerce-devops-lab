output "instance_public_ip" {
  description = "The public IP address of the provisioned EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "ssh_command" {
  description = "The SSH connection command to access the EC2 instance"
  value       = "ssh -i ~/.ssh/${var.ssh_key_name}.pem ubuntu@${aws_instance.app_server.public_ip}"
}
