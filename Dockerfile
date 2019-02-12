FROM ubuntu

RUN apt-get update && apt-get install -y openssl libssl-dev libssl1.0.0 libpq-dev

COPY mindstream /mindstream/mindstream
COPY static /mindstream/static

WORKDIR /

CMD /mindstream/mindstream
