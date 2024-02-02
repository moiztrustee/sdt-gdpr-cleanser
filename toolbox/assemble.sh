#!/usr/bin/env bash

function validate() {
  echo -e "$(green "validate")"
}

function __package() {
  
  for build in $(find ./dist -name "*.js")
  do

    local __file=$(basename -- "$build")
    local __lambda=$(echo "${__file}"  | sed -r 's/(.+)\.js/\1/g')

    echo -e "$(cyan "zipping") "${__file}""

    chmod +x ${build} #| mv ${build} "./dist/${__lambda}.js"
    ls -al ./dist

    zip -mqj "./dist/$__lambda.zip" "./dist/${__lambda}.js"
  done
}

function assemble(){
  cd ../code

  validate

  #eval "npm install"

  for source in $(find ./main/lambdas -name "*.ts")
  do
    local __lambda=$(basename -- "$source" | sed -r 's/(.+)\.ts/\1/g')
    eval "npm run build-${__lambda}"
  done

  __package

}

source ./_utils.sh
assemble
