# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies (will be cached unless package.json changes)
COPY package*.json ./
RUN npm install

# The actual code is mounted at runtime via volume for dev
CMD ["npm", "run", "dev"]
