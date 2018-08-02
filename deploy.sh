#NODE_ENV=production npm run webpack

rm -rf deploy
mkdir deploy

mkdir deploy/tmp
mkdir deploy/tmp/gene.iobio.vue
mkdir deploy/tmp/gene.iobio.vue/js
mkdir deploy/tmp/gene.iobio.vue/app
mkdir deploy/tmp/gene.iobio.vue/dist

ln -s ~/work/gene.iobio.vue/client/assets ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/assets
ln -s ~/work/gene.iobio.vue/client/js/thirdparty ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/js/thirdparty
ln -s ~/work/gene.iobio.vue/client/app/third-party ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/app/third-party
ln -s ~/work/gene.iobio.vue/client/dist/build.js ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/dist/build.js
ln -s ~/work/gene.iobio.vue/client/dist/build.js.map ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/dist/build.js.map
ln -s ~/work/gene.iobio.vue/server/views/index.html ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/index.html

cd deploy/tmp

#zip -r  ../gene.iobio.vue.zip ./gene.iobio.vue/*

#production - upload to cloudfront
#aws s3 cp ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/  s3://static.iobio.io/vue.gene.iobio.io/ --recursive

#dev - upload to cloudfront
#aws s3 cp ~/work/gene.iobio.vue/deploy/tmp/gene.iobio.vue/  s3://static.iobio.io/dev/gene.iobio.io/ --recursive

