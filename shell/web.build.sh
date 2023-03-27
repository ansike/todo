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

cd $HOME_DIR/$WEB_DIR
yarn build

mkdir -p $SCM_OUTPUT_DIR
cp -r $HOME_DIR/$WEB_DIR/build/. $SCM_OUTPUT_DIR
