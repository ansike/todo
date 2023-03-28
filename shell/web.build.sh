#!/bin/bash
# build pure web
set -e

HOME_DIR=$(pwd)
WEB_DIR=packages/web

# 构建时注入 web
[ `yarn -v | wc -l` -eq 0 ] && {
  npm i yarn -g
}

cd $WEB_DIR

yarn --force

yarn build
