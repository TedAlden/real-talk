FROM node:22.11

WORKDIR /balancer

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5001

CMD ["npm", "run", "start:prod"]
