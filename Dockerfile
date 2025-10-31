# Step 1: Build React app
FROM node:18 AS build
WORKDIR /app

# Copy package.json and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production app
RUN npm run build

# Step 2: Serve using NGINX
FROM nginx:alpine
COPY --from=build /app/dist /var/www/html

# Optional: Custom nginx config if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]





