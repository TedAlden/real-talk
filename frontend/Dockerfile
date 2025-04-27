FROM node:22.11

WORKDIR /frontend

COPY package*.json ./

RUN npm install

RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 5001

CMD ["serve", "-s", "build", "-l", "5001"]
