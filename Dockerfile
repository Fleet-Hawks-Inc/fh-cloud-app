

FROM nginx:stable-alpine

WORKDIR /app

COPY . .
RUN apk add nodejs-current npm
RUN node -v
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm install && npm run production && ls dist

RUN cd dist/fleethawks-dashboard && cp -r * /usr/share/nginx/html

RUN ls /usr/share/nginx/html
EXPOSE 80