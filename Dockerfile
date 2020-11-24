FROM node:alpine
WORKDIR /opt
COPY speedtest-code/ /opt/
RUN npm install --save
ENTRYPOINT ["node", "fast-speedtest-api.js"]


// sudo docker container run -it --name node --hostname fast-speedtest --entrypoint=/bin/ash
