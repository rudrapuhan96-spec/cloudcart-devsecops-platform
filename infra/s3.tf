data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "cloudcart_assets" {
  bucket        = "cloudcart-assets-${data.aws_caller_identity.current.account_id}"
  force_destroy = true

  tags = {
    Name        = "CloudCart Assets"
    Project     = "CloudCart"
    Environment = "lab"
  }
}

resource "aws_s3_bucket_public_access_block" "cloudcart_assets" {
  bucket = aws_s3_bucket.cloudcart_assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "cloudcart_assets" {
  bucket = aws_s3_bucket.cloudcart_assets.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "cloudcart_assets" {
  bucket = aws_s3_bucket.cloudcart_assets.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_ownership_controls" "cloudcart_assets" {
  bucket = aws_s3_bucket.cloudcart_assets.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}
