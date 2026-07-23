# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine AS runtime

# Create a non-root user
RUN addgroup -S nginxgroup && \
    adduser -S nginxuser -G nginxgroup

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Give the non-root user access to required directories
RUN chown -R nginxuser:nginxgroup \
    /usr/share/nginx/html \
    /var/cache/nginx \
    /var/run \
    /etc/nginx

# Run as non-root
USER nginxuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]