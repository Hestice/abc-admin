FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY tsconfig.base.json ./

RUN npm ci

COPY . .

RUN npx nx run api:build --configuration=production

FROM node:18-alpine as production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist/apps/api ./dist

RUN npm ci --omit=dev

ENV PORT=8080
EXPOSE ${PORT}

CMD ["node", "dist/main"]