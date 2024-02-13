FROM mongo:latest

WORKDIR /app

COPY package*.json .

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs

RUN npm install -g nodemon
RUN npm install

COPY . .
CMD [ "nodemon", "--legacy-watch", "index.js" ]
