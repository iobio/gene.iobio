set -eu

echo Build gene.iobio version $GENE_VERSION as user $USER

git clone -b $GENE_VERSION --depth 1 https://github.com/iobio/gene.iobio

cd gene.iobio

cp /build/.env ./

npm install

NODE_ENV=production npm run build

rm -rf /build/*

mkdir -p /build/js/
mkdir -p /build/app/
mkdir -p /build/dist/

cp ./server/views/index.html /build/index.html
cp -r ./client/data/ /build/data/
cp -r ./client/assets/ /build/assets/
cp -r ./client/js/thirdparty/ /build/js/
cp -r ./client/app/third-party/ /build/app/
cp ./client/dist/build.js /build/dist/build.js
cp ./client/dist/build.js.map /build/dist.build.js.map

chown -R $USER /build/*
