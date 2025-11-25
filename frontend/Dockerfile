# Build stage
FROM node:22-slim AS build
WORKDIR /app

# Use package-lock.json for npm
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:1.29.3-alpine
# Update OS packages to patch vulnerabilities
RUN apk update && apk upgrade --no-cache
COPY --from=build /app/build/client /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
