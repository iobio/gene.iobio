#!/bin/bash

rm -rf deploy
mkdir deploy
mkdir deploy/js
mkdir deploy/app
mkdir deploy/dist

# build vue app
if [[ $1 == "prod" ]]; then
  echo "** Building prod **"
  NODE_ENV=production npm run build
  #npm run build
elif [[ $1 == "stage" ]]; then
  echo "** Building stage **"
  NODE_ENV=production npm run build
  #npm run build
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
if [[ $1 == "prod" ]]; then
  ln -s $working_dir/client/dist/build.js.map $working_dir/deploy/dist/build.js.map
fi

# upload to cloudfront
if [[ $1 == "prod" ]]; then
  #aws s3 cp ./deploy/  s3://static.iobio.io/vue.gene.iobio.io/ --recursive
  #aws cloudfront create-invalidation --distribution-id EPK0TTL11YUW --paths /

  echo "** Uploaded to prod s3 bucket **"
  aws s3 cp ./deploy/  s3://static.iobio.io/prod/gene.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E331YTF25OIVP7 --paths /\*

# upload to cloudfront
elif [[ $1 == "stage" ]]; then
  #aws s3 cp ./deploy/  s3://static.iobio.io/vue.gene.iobio.io/ --recursive
  #aws cloudfront create-invalidation --distribution-id EPK0TTL11YUW --paths /

  echo "** Uploaded to stage s3 bucket **"
  aws s3 cp ./deploy/  s3://static.iobio.io/stage/gene.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E1XZ0L3S5I92GN --paths /\*



else
  echo "** Syncing to dev s3 bucket **"
  #aws s3 sync ./deploy/  s3://static.iobio.io/dev/gene.iobio.io/
  aws s3 cp  ./deploy/  s3://static.iobio.io/dev/gene.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E1RAE4AL1ULL9A --paths /\*
fi
