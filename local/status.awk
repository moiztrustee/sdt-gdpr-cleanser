BEGIN {
  status = 1
}

$1 ~ "running" && $2 ~ "localstack/localstack"{
  status = 0
}

END {
  exit status
}