#!/usr/bin/env bash

[[ "${_UTILS_SH:-"no"}" == "yes" ]] && return 0;

_UTILS_SH=yes;

GREEN="\e[32m"
RED="\e[31m"
YELLOW="\e[33m"
CYAN="\e[36m"
CLEAR="\e[0m"
ITALIC="\e[3m"
BOLD="\e[1m"
UNDERLINE="\e[4m"

function underline() {
  printf "${UNDERLINE}%s${CLEAR} \n" "$1";
}

function bold() {
  printf "${BOLD}%s${CLEAR} \n" "$1";
}

function italic() {
  printf "${ITALIC}%s${CLEAR} \n" "$1";
}

function green() {
    printf "${GREEN}%s${CLEAR} \n" "$1";
}

function yellow() {
    printf "${YELLOW}%s${CLEAR} \n" "$1";
}

function red() {
    printf "${RED}%s${CLEAR} \n" "$1";
}

function cyan() {
    printf "${CYAN}%s${CLEAR} \n" "$1";
}