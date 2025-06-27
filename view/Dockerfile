# Stage 1: build
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: serve
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
CMD ["serve", "-s", "build", "-l", "3000"]
# Stage 1: build
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: serve
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
CMD ["serve", "-s", "build", "-l", "3000"]
