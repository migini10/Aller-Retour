# Stage 1: Pruning monorepo for api
FROM node:20-alpine AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune api --docker

# Stage 2: Installing dependencies
FROM node:20-alpine AS installer
RUN apk update && apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./
RUN npm install --ignore-scripts

# Stage 3: Building project & generating Prisma Client
COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=api...

# Stage 4: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001
RUN apk update && apk add --no-cache openssl
COPY --from=installer /app/ .
EXPOSE 3001
CMD ["npm", "run", "start:prod"]
