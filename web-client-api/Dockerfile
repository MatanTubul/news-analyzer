FROM node:latest

WORKDIR /home/news-analyzer/web-client-api
COPY package.json .
RUN npm install

COPY . .
ENV NODE_ENV=production
ENTRYPOINT ["node", "./web-client-api.js"]