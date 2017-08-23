FROM node:alpine

COPY ./package.json /user/src/app/package.json
COPY ./server.js /user/src/app/server.js
COPY ./config /user/src/app/config

WORKDIR /user/src/app
RUN ( npm install )

VOLUME [ "/user/src/app/ssl", "/user/src/app/log" ]
EXPOSE 3000

CMD npm start 
