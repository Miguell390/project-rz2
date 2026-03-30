FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Exposes Vite port
CMD ["npm", "run", "dev", "--", "--host"]