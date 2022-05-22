FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn install --immutable
RUN yarn clean
RUN yarn build
CMD [ "yarn", "start:prod" ]
