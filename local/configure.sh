#!/usr/bin/env bash

set -e -o pipefail

function await_localstack() {
  printf '.'
  docker inspect --format '{{ .State.Status }} | {{ .Config.Image }}' $(docker ps -q) | awk -f ./local/status.awk -F '|'
}

function main() {

    printf 'waiting for localstack ... \n'
    local timeout=60

    until await_localstack; do

    sleep 1

    timeout=$(( timeout - 1 ))

    if [ $timeout -eq 0 ]; then
      return 1
    fi
    done
}

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../"
pushd "${PROJECT_DIR}" >/dev/null
source "./local/lib.sh"
main
popd >/dev/null