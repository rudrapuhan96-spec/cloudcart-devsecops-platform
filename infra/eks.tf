module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "21.26.0"

  name               = "cloudcart-eks"
  kubernetes_version = "1.33"

  endpoint_public_access = true
  endpoint_public_access_cidrs = ["27.60.220.81/32"]
  enable_cluster_creator_admin_permissions = true

  vpc_id = aws_vpc.main.id

  subnet_ids = aws_subnet.app[*].id

  enable_irsa = true

  addons = {
    coredns = {
      most_recent = true
    }

    kube-proxy = {
      most_recent = true
    }

    vpc-cni = {
      most_recent = true
    }

    eks-pod-identity-agent = {
      most_recent = true
    }
  }

  eks_managed_node_groups = {
    cloudcart_nodes = {
      name = "cloudcart-nodes"

      instance_types = ["t3.small"]

      min_size     = 2
      max_size     = 3
      desired_size = 2

      capacity_type = "ON_DEMAND"

      labels = {
        Project   = "CloudCart"
        Workload  = "Application"
        ManagedBy = "Terraform"
      }
    }
  }

  tags = {
    Project     = "CloudCart"
    Environment = "production"
    ManagedBy   = "Terraform"
  }
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "eks_cluster_security_group_id" {
  value = module.eks.cluster_security_group_id
}

output "eks_node_group_names" {
  value = keys(module.eks.eks_managed_node_groups)
}

output "eks_oidc_provider_arn" {
  value = module.eks.oidc_provider_arn
}




