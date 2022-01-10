### STAGE 1: Build ###

# We label our stage as 'hub'
FROM node:16.13.1-alpine3.14 as hub

COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN export NODE_OPTIONS=--max_old_space_size=8192 && npm install && mkdir /ng-app && cp -R ./node_modules ./ng-app

COPY ./scripts/start.sh ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN export NODE_OPTIONS=--max_old_space_size=8192 && $(npm bin)/ng build --configuration production --aot --base-href='$ARLAS_HUB_BASE_HREF/'

### STAGE 2: Setup ###

FROM nginx:1.13.3-alpine

RUN apk add --update bash jq netcat-openbsd curl && rm -rf /var/cache/apk/*

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'hub' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=hub /ng-app/dist/ /usr/share/nginx/html
COPY --from=hub /ng-app/start.sh /usr/share/nginx/

HEALTHCHECK CMD curl --fail http://localhost:80/ || exit 1

CMD /usr/share/nginx/start.sh
