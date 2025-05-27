# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Accept OPENAI_API_KEY as a build arg and set as env
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"] 