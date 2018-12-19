FROM node:latest
RUN mkdir -p /usr/src/appw
WORKDIR /usr/src/appw
COPY package.json /usr/src/appw/
RUN npm install
COPY . /usr/src/appw
EXPOSE 3000
CMD [ "npm", "start" ]