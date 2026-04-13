FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci  # Installs ALL deps (including dev) to generate/sync lockfile implicitly

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build  # Adjust to your build script

FROM node:20-alpine AS production
WORKDIR /app
# Copy only prod node_modules (prune dev deps)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist  # Adjust to your build output
EXPOSE 3000
CMD ["node", "dist/index.js"]  # Adjust entrypoint