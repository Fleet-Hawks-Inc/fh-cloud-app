FROM node:12.20.0 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run buildPreprod

### STAGE 2: Run ###
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist/fleethawks-dashboard /usr/share/nginx/html

EXPOSE 80