module "dynamodb" {
  source                             = "git@github.com:trustedshops/terraform-module-core-dynamodb.git?ref=2.0.1"
  name                               = "${local.service_name}-cleanser"
  server_side_encryption_kms_key_arn = data.aws_kms_key.this.arn
  hash_key                           = "Bucket"
  range_key                          = "FilePath"
  attributes = [
    {
      name = "Bucket"
      type = "S"
    },
    {
      name = "FilePath"
      type = "S"
    }
  ]
}
