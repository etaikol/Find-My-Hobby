# frontend/Dockerfile.dev
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

# Mount your source in docker-compose, so no need to COPY it here
CMD ["npm", "run", "dev"]