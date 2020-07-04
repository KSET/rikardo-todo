FROM node:14.4.0-buster-slim

RUN mkdir /rikardo
WORKDIR /rikardo

RUN apt-get update \
    && apt-get install nginx -y \
    && apt-get clean

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
COPY ./nginx.conf /etc/nginx/sites-enabled/default

ENTRYPOINT ["bash", "docker_entrypoint.sh"]
