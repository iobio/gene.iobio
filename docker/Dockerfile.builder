FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    curl \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y \
    git \
    nodejs \
    python2 \
    && rm -rf /var/lib/apt/lists/*


COPY ./docker/build.sh ./

CMD ./build.sh
