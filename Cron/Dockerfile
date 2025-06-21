FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies if needed for build)
RUN npm install

# Then copy the rest of your files
COPY . .

CMD ["node", "main.js"]