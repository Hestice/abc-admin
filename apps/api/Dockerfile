FROM node:18-alpine as development

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY workspace.json ./

RUN npm install

COPY . .

RUN npm run build api

FROM node:18-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /app/dist/apps/api ./dist

CMD ["node", "dist/main"]