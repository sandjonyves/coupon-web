FROM node:18-slim

WORKDIR /app


COPY . .

RUN npm install --silent


RUN npm run build:css


RUN npm prune --production

EXPOSE 3000

CMD ["node", "./bin/www"]
