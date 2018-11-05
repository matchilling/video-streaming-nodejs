FROM node:8.9.0-alpine

MAINTAINER Mathias Schilling <m@matchilling.com>

ENV APP_PATH /var/www/app

RUN apk add --update bash && \
    rm -rf /var/cache/apk/*

# Create app directory
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

# Install app dependencies
COPY . $APP_PATH
RUN rm -rf node_modules/
RUN npm install -dd

EXPOSE 3000

CMD ["npm", "start"]
