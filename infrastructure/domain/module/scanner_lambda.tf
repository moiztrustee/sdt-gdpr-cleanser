module "scanner_lambda" {
  source                     = "git@github.com:trustedshops/terraform-module-core-lambda.git?ref=2.1.2"
  description                = "Scanner lamda"
  function_name              = "${local.service_name}--scanner"
  kms_key_arn                = data.aws_kms_key.this.arn
  handler                    = "scanner.handler"
  runtime                    = "nodejs16.x"
  filename                   = data.archive_file.scanner.output_path
  timeout                    = 300
  iam_role_extra_policy_json = data.aws_iam_policy_document.scanner_lambda.json
  environment = {
    "TABLE_NAME"             = module.dynamodb.table_id
    "S3_BUCKET"              = module.s3.bucket_id
  }
}

