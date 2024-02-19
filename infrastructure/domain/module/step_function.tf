resource "aws_sfn_state_machine" "this" {
  name     = "${local.service_name}-cleanser"
  role_arn = aws_iam_role.step_function.arn

  definition = file("${path.module}/step-function.json")
}

resource "aws_iam_role" "step_function" {
  name               = "${local.service_name}-step-function"
  assume_role_policy = data.aws_iam_policy_document.step_function_assume_role.json
}

resource "aws_iam_policy" "step_function" {
  name   = "${local.service_name}-step-function"
  policy = data.aws_iam_policy_document.permissions.json
}

resource "aws_iam_role_policy_attachment" "step_function" {
  role       = aws_iam_role.step_function.name
  policy_arn = aws_iam_policy.step_function.arn
}

data "aws_iam_policy_document" "step_function_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["states.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "permissions" {
  statement {
    actions = [
      "lambda:InvokeFunction"
    ]

    resources = [
      module.cleanser_lambda.arn,
      module.scanner_lambda.arn,
    ]
  }
}
