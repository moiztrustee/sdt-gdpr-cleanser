#!/usr/bin/env bash

function main() {

    local compose_file="./local/./local/compose.yaml"

    docker-compose -p vw-fs-localstack --file ${compose_file} down
}

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../"

pushd "${PROJECT_DIR}" > /dev/null
  main
popd > /dev/null
