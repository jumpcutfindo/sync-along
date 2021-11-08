# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:12
WORKDIR /src

# Copy current directory package.json and package-lock.json to the container file
COPY package*.json ./ 
RUN npm install
COPY dist dist/
COPY tsconfig.json tsconfig.json
# backend is running on port 4001
EXPOSE 4001
CMD ["npm", "run", "prod"]