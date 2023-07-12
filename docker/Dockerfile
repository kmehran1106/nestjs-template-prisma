# DEV
FROM node:18-alpine as dev
RUN apk add --no-cache libc6-compat
WORKDIR /usr/code/src
ENV NODE_ENV dev
RUN addgroup --system user && adduser --system user && chown -R user:user /usr/code && chmod -R 755 /usr/code
COPY . .
RUN npm ci && npx prisma generate

# PROD - BUILD
FROM node:18-alpine as build
WORKDIR /usr/code/src
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production
RUN addgroup --system user && adduser --system user && chown -R user:user /usr/code && chmod -R 755 /usr/code
COPY --chown=user:user --from=dev /app/node_modules ./node_modules
COPY . .
RUN npm ci
RUN npm run build && npm prune --production

# PROD - SERVER
FROM node:18-alpine as prod
WORKDIR /usr/code/src
RUN apk add --no-cache libc6-compat
ENV NODE_ENV production
RUN addgroup --system user && adduser --system user && chown -R user:user /usr/code && chmod -R 755 /usr/code
COPY --from=build /usr/code/src/dist dist
COPY --from=build /usr/code/src/node_modules node_modules
CMD ["node", "dist/main.js"]