FROM node:18 as base
WORKDIR /
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build
CMD ["yarn","start"]