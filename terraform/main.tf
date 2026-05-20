# Fetch the latest official Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name     = "name"
    values   = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name     = "virtualization-type"
    values   = ["hvm"]
  }
}

# 1. Custom Virtual Private Cloud (VPC)
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.app_name}-${var.environment}-vpc"
    Environment = var.environment
  }
}

# 2. Internet Gateway for External Access
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.app_name}-${var.environment}-igw"
    Environment = var.environment
  }
}

# 3. Public Subnet for the EC2 Application Instance
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.app_name}-${var.environment}-public-subnet"
    Environment = var.environment
  }
}

# 4. Route Table for Routing Internet Traffic to IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name        = "${var.app_name}-${var.environment}-public-rt"
    Environment = var.environment
  }
}

# 5. Route Table Association
resource "aws_route_table_association" "public_association" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# 6. Security Group for Access Control
resource "aws_security_group" "app_sg" {
  name        = "${var.app_name}-${var.environment}-sg"
  description = "Allow inbound traffic for SSH, HTTP Frontend, Backend API, and Database"
  vpc_id      = aws_vpc.main.id

  # SSH Access (used by administrators & Ansible)
  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # In production, restrict this to your specific public IP for security
  }

  # HTTP Web Interface Access
  ingress {
    description = "Frontend Web Application"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Spring Boot Backend REST API Access
  ingress {
    description = "Backend REST API"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # MySQL Database Access (Optional / for direct debug access if needed)
  ingress {
    description = "MySQL database server"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Recommended to close or restrict to app VPC in strict prod environments
  }

  # Full outbound connection (required for system updates & pulling Docker images)
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name        = "${var.app_name}-${var.environment}-sg"
    Environment = var.environment
  }
}

# 7. Provision the EC2 Instance
resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]
  key_name               = var.ssh_key_name

  # Allocate more storage for Docker images & local build artifacts
  root_block_device {
    volume_size           = 20
    volume_type           = "gp3"
    delete_on_termination = true
  }

  tags = {
    Name        = "${var.app_name}-${var.environment}-server"
    Environment = var.environment
    Service     = "finance-app"
  }
}
