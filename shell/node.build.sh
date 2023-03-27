#!/bin/bash

# build node and recognize web apps

set -e

# 设置目录变量
HOME_DIR=$(pwd)
WEB_DIR=$HOME_DIR/packages/web/build
SCM_OUTPUT_DIR=$HOME_DIR/output
NODE_STATIC_DIR=$SCM_OUTPUT_DIR/packages/node/staitc
NODE_DIR=packages/node

[ $(yarn -v | wc -l) -eq 0 ] && {
  npm i yarn -g
}

mkdir -p $SCM_OUTPUT_DIR/$NODE_DIR
cp -r package.json .npmrc yarn.lock $SCM_OUTPUT_DIR

# includes dotfiles
cp -r $NODE_DIR/. $SCM_OUTPUT_DIR/$NODE_DIR

cd $SCM_OUTPUT_DIR
yarn --force

cd $SCM_OUTPUT_DIR/$NODE_DIR
yarn build

# remove useless files
rm -rf node_modules building src
if [ "$DEBUG_MODE" == "" ]; then
  echo "remove sourcemaps"
  find static/ -name "*.map" | xargs rm -rf
else
  echo "keep sourcemaps for debug"
fi
cd $SCM_OUTPUT_DIR
rm -rf node_modules

# reinstall node deps
yarn --force --production

# 编译web
cd $HOME_DIR
sh $HOME_DIR/shell/web.build.sh

# mv static file
mkdir -p $NODE_STATIC_DIR
cp -r $WEB_DIR/ $SCM_OUTPUT_DIR/packages/node/staitc

