module "cleanser_lambda" {
  source                     = "git@github.com:trustedshops/terraform-module-core-lambda.git?ref=2.1.2"
  description                = "Cleanser lamda"
  function_name              = "${local.service_name}--cleanser"
  kms_key_arn                = data.aws_kms_key.this.arn
  handler                    = "cleanser.handler"
  runtime                    = "nodejs16.x"
  filename                   = data.archive_file.cleanser.output_path
  timeout                    = 300
  iam_role_extra_policy_json = data.aws_iam_policy_document.cleanser_lambda.json
  environment = {
    "TABLE_NAME"             = module.dynamodb.table_id
  }
}

