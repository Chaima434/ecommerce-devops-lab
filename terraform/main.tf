# Fetch the latest official Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 1. Use the existing Default VPC (avoids VpcLimitExceeded on AWS Academy accounts)
data "aws_vpc" "default" {
  default = true
}

# 2. Use the first available default subnet in the default VPC
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 3. Security Group for Access Control (attached to the default VPC)
resource "aws_security_group" "app_sg" {
  name        = "${var.app_name}-${var.environment}-sg"
  description = "Allow inbound traffic for SSH, HTTP Frontend, Backend API, NodePorts and Database"
  vpc_id      = data.aws_vpc.default.id

  # SSH Access (used by administrators & Ansible)
  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP Web Interface (Docker Compose / direct)
  ingress {
    description = "Frontend Web Application"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # API Gateway
  ingress {
    description = "Backend REST API"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Kubernetes NodePort — Frontend
  ingress {
    description = "K8s NodePort Frontend"
    from_port   = 30080
    to_port     = 30080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Kubernetes NodePort — Prometheus
  ingress {
    description = "K8s NodePort Prometheus"
    from_port   = 30090
    to_port     = 30090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Kubernetes NodePort — Grafana
  ingress {
    description = "K8s NodePort Grafana"
    from_port   = 30300
    to_port     = 30300
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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

# 4. Provision the EC2 Instance using the default VPC subnet
resource "aws_instance" "app_server" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  subnet_id              = tolist(data.aws_subnets.default.ids)[0]
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

# 5. AWS EventBridge Integration
resource "aws_cloudwatch_event_bus" "finmanage_bus" {
  name = "finmanage-bus"
}

resource "aws_cloudwatch_event_rule" "amount_over_500" {
  name           = "amount-over-500"
  description    = "Alert when transaction amount is greater than 500"
  event_bus_name = aws_cloudwatch_event_bus.finmanage_bus.name

  event_pattern = jsonencode({
    source      = ["com.finance.depenses"]
    detail-type = ["TransactionCreated"]
    detail = {
      montant = [{ numeric = [">", 500] }]
    }
  })
}

resource "aws_cloudwatch_event_target" "sns_target" {
  rule           = aws_cloudwatch_event_rule.amount_over_500.name
  event_bus_name = aws_cloudwatch_event_bus.finmanage_bus.name
  arn            = aws_sns_topic.finmanage_alerts.arn
}

resource "aws_sns_topic" "finmanage_alerts" {
  name = "finmanage-alerts"
}

resource "aws_sns_topic_policy" "default" {
  arn    = aws_sns_topic.finmanage_alerts.arn
  policy = data.aws_iam_policy_document.sns_topic_policy.json
}

data "aws_iam_policy_document" "sns_topic_policy" {
  statement {
    effect  = "Allow"
    actions = ["SNS:Publish"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }

    resources = [aws_sns_topic.finmanage_alerts.arn]
  }
}

resource "aws_sns_topic_subscription" "email_sub" {
  topic_arn = aws_sns_topic.finmanage_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}
