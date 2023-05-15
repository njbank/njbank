FROM node:16-alpine as build
WORKDIR /njbank

COPY package*.json ./

RUN npm ci

COPY . ./
RUN  npm run build

FROM node:19-alpine
WORKDIR /njbank

COPY package*.json ./

RUN npm ci --production 

COPY --from=build /njbank/dist /njbank/dist

CMD [ "node", "dist/main.js" ]
