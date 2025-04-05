FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk add --no-cache openssl

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]

