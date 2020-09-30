FROM node:12-slim

WORKDIR /app

COPY src/. /app/src
COPY static/. /app/static
COPY page-parser/. /app/page-parser
COPY bcms.config.js /app
COPY gatsby-config.js /app
COPY gatsby-node.js /app
COPY package.json /app
COPY package-lock.json /app
COPY bundle.js /app
COPY tsconfig.json /app
COPY tslint.json /app
COPY postcss.config.js /app
COPY tailwind.config.js /app
COPY robots-production.txt /app
COPY robots-staging.txt /app

RUN mkdir /app/docker-cache
RUN mkdir /app/docker-cache/node_modules

ENTRYPOINT [ "npm", "run", "bundle" ]