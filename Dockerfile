FROM public.ecr.aws/i6d0h2n7/node:12.7.0 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run buildPreprod

### STAGE 2: Run ###
FROM public.ecr.aws/i6d0h2n7/nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/fleethawks-dashboard /usr/share/nginx/html

EXPOSE 80