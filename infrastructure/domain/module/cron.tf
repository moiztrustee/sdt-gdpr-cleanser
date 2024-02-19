# resource "aws_cloudwatch_event_rule" "this" {
#   name                = "${local.service_name}-daily"
#   description         = "Trigger daily gdpr cleanser to delete the files from s3 bucket"
#   schedule_expression = "cron(0/10 * * * ? *)"
# }

# resource "aws_cloudwatch_event_target" "this" {
#   rule      = aws_cloudwatch_event_rule.this.name
#   target_id = "StartStepFunctions"
#   arn       = aws_sfn_state_machine.this.arn
#   role_arn  = aws_iam_role.cloudwatch_event.arn
# }

# data "aws_iam_policy_document" "cloudwatch_event_assume_role" {
#   statement {
#     actions = ["sts:AssumeRole"]

#     principals {
#       type        = "Service"
#       identifiers = ["events.amazonaws.com"]
#     }
#   }
# }

# data "aws_iam_policy_document" "cloudwatch_event" {
#   statement {
#     effect  = "Allow"
#     actions = ["states:StartExecution"]
#     resources = [
#       aws_sfn_state_machine.this.arn
#     ]
#   }
# }

# resource "aws_iam_role" "cloudwatch_event" {
#   name               = "${local.service_name}-cloudwatch-event"
#   assume_role_policy = data.aws_iam_policy_document.cloudwatch_event_assume_role.json
# }

# resource "aws_iam_policy" "cloudwatch_event" {
#   name   = "${local.service_name}-cloudwatch-event"
#   policy = data.aws_iam_policy_document.cloudwatch_event.json
# }

# resource "aws_iam_role_policy_attachment" "cloudwatch_event" {
#   policy_arn = aws_iam_policy.cloudwatch_event.arn
#   role       = aws_iam_role.cloudwatch_event.name
# }
