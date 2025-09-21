FROM node:22-slim

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npm run build

EXPOSE 3000

CMD ["npx", "server", "build"]