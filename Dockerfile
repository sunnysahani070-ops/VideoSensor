# Stage 1: Build client
FROM node:20-alpine AS client-builder
WORKDIR /app
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
RUN npm install
COPY client ./client
RUN npm run build -w client

# Stage 2: Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Install ffmpeg for media processing
RUN apk add --no-cache ffmpeg

COPY package*.json ./
COPY server/package*.json ./server/
RUN npm install --omit=dev

COPY server ./server
COPY --from=client-builder /app/client/dist ./client/dist

# Create storage directory
RUN mkdir -p /app/uploads /app/temp_uploads

EXPOSE 5000

CMD ["node", "server/src/index.js"]
