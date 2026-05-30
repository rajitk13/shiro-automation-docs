FROM node:22-alpine

WORKDIR /app

# Install shiro binary for workflow validation
RUN apk add --no-cache curl && \
    curl -fsSL -o /usr/local/bin/shiro \
      https://github.com/rajitk13/shiro-automation/releases/latest/download/shiro-linux-amd64 && \
    chmod +x /usr/local/bin/shiro

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

EXPOSE 3325

ENV PORT=3325
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "start"]
