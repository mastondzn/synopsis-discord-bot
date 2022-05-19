FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn clean
RUN yarn install --immutable
RUN yarn build
CMD [ "node", "build/src/main.js" ]
