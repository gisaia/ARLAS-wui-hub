### STAGE 1: Build ###

# We label our stage as 'hub'
FROM node:18.20.5 AS hub

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i --ignore-scripts && npm run postinstall && mkdir /ng-app && cp -R ./node_modules ./ng-app

COPY ./scripts/start.sh ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build

### STAGE 2: Setup ###

FROM nginx:1.25.3-alpine3.18-slim

RUN apk update && apk upgrade && apk add  bash jq netcat-openbsd curl && rm -rf /var/cache/apk/*

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'hub' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=hub /ng-app/dist/ /usr/share/nginx/html
COPY --from=hub /ng-app/start.sh /usr/share/nginx/

HEALTHCHECK CMD curl --fail http://localhost:8080/ || exit 1

CMD /usr/share/nginx/start.sh
