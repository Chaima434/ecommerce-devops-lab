# Personal Finance Tracker: Automated Deployment Guide 🚀

This document provides step-by-step instructions on provisioning cloud infrastructure on AWS using **Terraform** and deploying the entire multi-container Docker application using **Ansible**.

---

## 🛠 Prerequisites

Ensure you have the following installed on your local control machine:
1. **Terraform** (v1.5.0+) -> [Download](https://developer.hashicorp.com/terraform/downloads)
2. **Ansible** (v2.12+) -> [Download](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html)
3. **AWS CLI** configured with administrator credentials -> [Configure AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
4. An **AWS EC2 Key Pair** (PEM format) downloaded and stored at `~/.ssh/suivi-depenses-key.pem`.

---

## 🌐 Phase 1: Provisioning Infrastructure with Terraform

Terraform will build a completely isolated VPC network, configure routing, define firewall access groups, and spin up an optimized Ubuntu server.

### 1. Configure Variables
Navigate to the `terraform` directory:
```bash
cd terraform
```
Duplicate the example variable file:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Open `terraform.tfvars` and update the parameters (specifically `ssh_key_name` to match your existing AWS key pair).

### 2. Initialize and Apply
Initialize the provider plugins:
```bash
terraform init
```

Validate the configurations to ensure zero syntax issues:
```bash
terraform validate
```

View the execution plan to see the list of resources to be provisioned:
```bash
terraform plan
```

Deploy the cloud resources (type `yes` when prompted):
```bash
terraform apply
```

Once deployment succeeds, note down the output parameters:
* `instance_public_ip` (e.g., `54.210.45.109`)
* `ssh_command`

---

## 📦 Phase 2: Configuration & Deployment with Ansible

Ansible will connect to the newly created server, install Docker and its dependencies, configure our container variables, upload the application source code, and bring up the system.

### 1. Configure the Inventory
Navigate to the `ansible` directory:
```bash
cd ../ansible
```

Open `inventory.ini` and replace the placeholder IP address (`192.0.2.1`) with the real `instance_public_ip` output by Terraform. Double check that the path to your `.pem` key file is correct:
```ini
[app_servers]
54.210.45.109 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/suivi-depenses-key.pem
```

### 2. Configure Credentials & Custom Variables
Open `vars/main.yml`. You can adjust:
* Port configuration (`api_port`, `interface_port`, `mysql_port`).
* Security passwords (`mysql_root_password`).

> [!TIP]
> In production environments, sensitive parameters (like `mysql_root_password`) should be encrypted using **Ansible Vault** for added security:
> `ansible-vault encrypt_string 'your_secure_password' --name 'mysql_root_password'`

### 3. Run the Playbook
Execute the Ansible playbook using:
```bash
ansible-playbook -i inventory.ini playbook.yml
```

This will run the full provisioning automation:
1. **Common Setup**: Validates target host is running Ubuntu.
2. **Docker Role**: Adds Docker's GPG keys, configures the apt repositories, installs Docker + Docker Compose, and registers the server user in the docker daemon group.
3. **Deployment Role**: Automatically copies the frontend & backend codebases (excluding redundant folders like `node_modules` or `target`), generates a secure remote `.env` configuration file, builds the dockerized images on the host, and starts the multi-container stack.

---

## 🔍 Verification & Accessing the Application

Once Ansible completes successfully:
1. **Frontend UI**: Open your browser and navigate to `http://<your-instance-ip>`.
2. **Backend API**: Verify the Spring Boot backend REST endpoints at `http://<your-instance-ip>:8080/api/` (or matching port configurations).
3. **Database Port**: The MySQL instance is available at port `3306` (if enabled in security groups).

To check logs or status directly on the server, SSH using the command provided by Terraform:
```bash
ssh -i ~/.ssh/suivi-depenses-key.pem ubuntu@<your-instance-ip>
```
Once inside the instance:
```bash
# Go to app directory
cd /opt/suivi-depenses

# Check status of running containers
docker compose ps

# View real-time container logs
docker compose logs -f
```

---

## 🧹 Cleaning Up Resources

To avoid incurring ongoing cloud costs when you are done testing, destroy the resources with Terraform:
```bash
cd ../terraform
terraform destroy
```
Type `yes` when prompted, and Terraform will cleanly remove all provisioned subnets, VPCs, and server instances.
