FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run React dev server, listen on all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]