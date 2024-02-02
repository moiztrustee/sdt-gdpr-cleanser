provider "aws" {
  region = "eu-central-1"
  default_tags {
    tags = {
      ts-project   = "solution-design"
      ts-stage     = "dev"
      ts-component = "sdt-gdpr"
    }
  }
}

module "this" {
  source          = "../../module"
  stage           = "dev"
}
