# Stage 1: 
FROM node:16-alpine AS builder
WORKDIR /usr/Node.js/app
COPY package*.json ./
RUN npm install
COPY . .


# Stage 2: 
FROM node:16-alpine
WORKDIR /usr/Node.js/app
COPY --from=builder /usr/Node.js/app .
EXPOSE 8000
CMD ["node", "app.js"]
