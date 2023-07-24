FROM node:20-alpine
WORKDIR /usr/app

EXPOSE 8080
ENTRYPOINT [ "npm", "run", "start:debug:docker" ]
