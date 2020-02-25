

FROM nginx:stable-alpine

WORKDIR /app

COPY . .
RUN apk add --update nodejs npm
RUN  npm install && npm run build --production && ls dist

RUN cd dist/fleethawks-dashboard && cp -r * /usr/share/nginx/html

RUN ls /usr/share/nginx/html
EXPOSE 80