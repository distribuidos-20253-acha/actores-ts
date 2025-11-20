# Use an official Node.js image
FROM node:24-alpine3.21

# Set working directory
WORKDIR /app/actores-ts

# Copy only package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the files
COPY . .

ARG ACTOR_LISTENING_HOST_PUBSUB
ARG ACTOR_LISTENING_PORT_PUBSUB
ARG LOAD_MANAGER_HOST
ARG LOAD_MANAGER_PORT
ARG STORAGE_MANAGER_HOST
ARG STORAGE_MANAGER_PORT
ARG FALLBACK_STORAGE_MANAGER_HOST
ARG FALLBACK_STORAGE_MANAGER_PORT

RUN echo "ACTOR_LISTENING_HOST_PUBSUB=${ACTOR_LISTENING_HOST_PUBSUB}" > .env \
  && echo "ACTOR_LISTENING_PORT_PUBSUB=${ACTOR_LISTENING_PORT_PUBSUB}" >> .env \
  && echo "LOAD_MANAGER_HOST=${LOAD_MANAGER_HOST}" >> .env \
  && echo "LOAD_MANAGER_PORT=${LOAD_MANAGER_PORT}" >> .env \
  && echo "FALLBACK_STORAGE_MANAGER_HOST=${FALLBACK_STORAGE_MANAGER_HOST}" >> .env \
  && echo "FALLBACK_STORAGE_MANAGER_PORT=${FALLBACK_STORAGE_MANAGER_PORT}" >> .env \
  && echo "STORAGE_MANAGER_HOST=${STORAGE_MANAGER_HOST}" >> .env \
  && echo "STORAGE_MANAGER_PORT=${STORAGE_MANAGER_PORT}" >> .env

# Esto hace que no sea un servicio, sino una app de docker
ENTRYPOINT ["node", "index.ts"]