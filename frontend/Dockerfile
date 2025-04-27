FROM node:22.11

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5002

CMD ["npm", "run", "dev", "--", "--host"]
