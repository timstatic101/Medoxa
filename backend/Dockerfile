FROM node:20.15.1-alpine

RUN apk update && apk add bash
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production


# Bundle app source
COPY . .


EXPOSE 8080

CMD [ "yarn", "start" ]
