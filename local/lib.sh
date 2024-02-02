#!/usr/bin/env bash

function log() {
  echo "$1" >&2
}

function aws_local() {

  aws --endpoint-url=http://localhost:4566 --region=eu-central-1 --no-sign-request "$@"
}