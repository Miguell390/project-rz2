FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# We use nodemon for hot-reloading during Sprint 1 dev
CMD["npx", "nodemon", "index.js"]