# Stage 1: Get shiro binary from official image
FROM ghcr.io/rajitk13/shiro-automation:latest AS shiro

# Stage 2: Build the docs app
FROM node:22-alpine

WORKDIR /app

# Copy shiro binary from stage 1
COPY --from=shiro /usr/local/bin/shiro /usr/local/bin/shiro

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3325

ENV PORT=3325
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
