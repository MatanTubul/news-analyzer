### STAGE 1: Build ###
FROM node:12 as build

COPY package.json .
RUN npm install

COPY . .
ARG BUILD_ENV=production
RUN NODE_ENV=$BUILD_ENV
RUN npm run build

### STAGE 2: Production Environment ###
FROM nginx:1.13.12-alpine
COPY --from=build /build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /var/lib/apt/lists/*
COPY nginx/*.conf /etc/nginx/
COPY nginx/config/news-analyzer.cert /etc/nginx/news-analyzer.cert
COPY nginx/config/news-analyzer.key /etc/nginx/news-analyzer.key


CMD ["nginx", "-g", "daemon off;"]