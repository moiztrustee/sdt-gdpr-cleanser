module "s3" {
  source      = "git@github.com:trustedshops/terraform-module-core-s3.git?ref=5.0.1"
  name        = "${local.service_name}-archived"
  kms_key_arn = data.aws_kms_key.this.arn
}
