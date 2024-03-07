data "aws_kms_key" "this" {
  key_id = "alias/global-kms-key"
}

data "archive_file" "cleanser" {
  type        = "zip"
  source_file = "${path.module}/index.js"
  output_path = "cleanser-lambda.zip"
}

data "archive_file" "scanner" {
  type        = "zip"
  source_file = "${path.module}/index.js"
  output_path = "scanner-lambda.zip"
}


data "aws_iam_policy_document" "cleanser_lambda" {

  statement {
    actions = [
      "s3:GetObject*",
      "s3:GetBucket*",
      "s3:List*",
      "s3:Abort*",
      "s3:PutObject*",
      "s3:DeleteObject"
    ]

    resources = [
        "*"
    ]

    effect = "Allow"
  }  

  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:Query"
    ]

    resources = [
      module.dynamodb.table_arn,
      "${module.dynamodb.table_arn}/*",
    ]
  }
}


data "aws_iam_policy_document" "scanner_lambda" {

  statement {
    actions = [
      "s3:GetObject*",
      "s3:GetBucket*",
      "s3:List*",
      "s3:Abort*",
      "s3:PutObject*"
    ]

    resources = [
        "*"
    ]

    effect = "Allow"
  }  

  statement {
    actions = [
      "dynamodb:PutItem"
    ]

    resources = [
      module.dynamodb.table_arn,
      "${module.dynamodb.table_arn}/*",
    ]
  }
}