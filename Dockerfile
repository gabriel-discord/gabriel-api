FROM node:16-alpine3.13
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY src/ .
EXPOSE 3000/tcp
CMD [ "node", "index.js" ]
