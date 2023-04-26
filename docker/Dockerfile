FROM ubuntu:22.04 AS builder


RUN apt-get update && apt-get install -y curl && \
        curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
        apt-get install -y nodejs python2

COPY . /gene.iobio/

WORKDIR /gene.iobio/

RUN npm install

RUN NODE_ENV=production npm run build

RUN curl -LO https://github.com/caddyserver/caddy/releases/download/v2.6.4/caddy_2.6.4_linux_amd64.tar.gz
RUN tar -xf caddy_2.6.4_linux_amd64.tar.gz


FROM ubuntu:22.04

WORKDIR /gene.iobio/

COPY --from=builder /gene.iobio/server/views/index.html ./index.html
COPY --from=builder /gene.iobio/client/data ./data
COPY --from=builder /gene.iobio/client/assets ./assets
COPY --from=builder /gene.iobio/client/js/thirdparty ./js/thirdparty
COPY --from=builder /gene.iobio/client/app/third-party ./app/third-party
COPY --from=builder /gene.iobio/client/dist/build.js ./dist/build.js
COPY --from=builder /gene.iobio/client/dist/build.js.map ./dist.build.js.map

COPY --from=builder /gene.iobio/caddy /usr/bin/

CMD caddy file-server --listen :4026 --root /gene.iobio
