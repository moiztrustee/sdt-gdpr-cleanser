#!/usr/bin/env bash

set -eo pipefail

function main(){
  cd ./code
  npm run test
}

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../"

pushd "${PROJECT_DIR}" >/dev/null
main
popd >/dev/null
