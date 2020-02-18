

FROM nginx:1.14.1-alpine

WORKDIR /app

COPY dist/fleethawks-dashboard /usr/share/nginx/html

EXPOSE 80