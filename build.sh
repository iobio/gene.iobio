#!/bin/bash
rm -rf deploy
mkdir deploy
mkdir deploy/js
mkdir deploy/app
mkdir deploy/dist

if test -f ".env"; then
  echo ".env exists."
else
  cp .env.template .env
fi

# build vue app
if [[ $1 == "prod" ]]; then
  echo "** Building prod **"
  NODE_ENV=production npm run build
  #npm run build
elif [[ $1 == "stage" ]]; then
  echo "** Building stage **"
  #NODE_ENV=production npm run build
  npm run build
elif [[ $1 == "learngene" ]]; then
  echo "** Building learngene **"
  cp .envTemplateExhibit .env
  NODE_ENV=production npm run build
  
else
  echo "** Building dev **"
  npm run build
fi

working_dir=$PWD

# link to files needed for static page
ln -s $working_dir/server/views/index.html $working_dir/deploy/index.html
ln -s $working_dir/client/data $working_dir/deploy/data
ln -s $working_dir/client/assets $working_dir/deploy/assets
ln -s $working_dir/client/js/thirdparty $working_dir/deploy/js/thirdparty
ln -s $working_dir/client/app/third-party $working_dir/deploy/app/third-party
ln -s $working_dir/client/dist/build.js $working_dir/deploy/dist/build.js
ln -s $working_dir/client/dist/build.js.map $working_dir/deploy/dist/build.js.map
