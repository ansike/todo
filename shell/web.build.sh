#!/bin/bash
# build pure web
set -e

HOME_DIR=$(pwd)
SCM_OUTPUT_DIR=$HOME_DIR/web
WEB_DIR=packages/web

# 构建时注入 web
[ `yarn -v | wc -l` -eq 0 ] && {
  npm i yarn -g
}

yarn --force

yarn build
