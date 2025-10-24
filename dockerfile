FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:css
EXPOSE 3000
CMD ["node", "./bin/www"]
