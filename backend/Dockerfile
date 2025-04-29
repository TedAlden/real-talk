FROM node:22.11

WORKDIR /backend

COPY package*.json ./

RUN npm install --build-from-source=bcrypt

COPY . .

EXPOSE 5001

CMD ["npm", "run", "dev"]
