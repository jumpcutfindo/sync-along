# https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

FROM node:12
WORKDIR /src

# Copy current directory package.json and package-lock.json to the container file
COPY package*.json ./ 
RUN npm install
COPY build build/

# front-end is running on port 3000
EXPOSE 3000 
RUN npm install -g serve
CMD ["serve", "-s", "build"]
# CMD ["se