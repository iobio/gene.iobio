#!/bin/bash

cd /src
# TODO: figure out how to get rid of unsafe-perm
npm install --unsafe-perm
./build.sh
# Need to use -L to follow symlinks otherwise they'll point to the wrong place
# in the host environment
cp -aL deploy/* /build/
