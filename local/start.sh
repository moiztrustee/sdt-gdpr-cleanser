#!/usr/bin/env bash

set -e -o pipefail

function main() {

  local compose_file="./local/compose.yaml"

  if [ ! -z ${DOCKER_HOST} ]; then
    export LOCALSTACK_DOCKER_HOST=${DOCKER_HOST}
    export LOCALSTACK_HOST=docker
  fi

  docker-compose -p vw-fs-localstack --file ${compose_file} up --build --detach

}

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../"
pushd "${PROJECT_DIR}" >/dev/null
main
popd >/dev/null
