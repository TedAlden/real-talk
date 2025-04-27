FROM node:22.11 AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

RUN npm install -g serve

COPY . .

RUN npm run build




FROM nginx:alpine

COPY --from=build /frontend/nginx /etc/nginx/conf.d


COPY --from=build /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
