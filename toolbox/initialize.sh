#!/usr/bin/env bash

function main(){

  cd ./code
  npm install
}

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../"

pushd "${PROJECT_DIR}" >/dev/null
main
popd >/dev/null
