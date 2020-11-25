FROM node:alpine
WORKDIR /opt
COPY speedtest-code/ /opt/
RUN npm install --save
ENTRYPOINT ["node", "fast-speedtest-api.js"]


// sudo docker container run -d --rm --name node --hostname fast-speedtest 0nth/fast-speedtest:node-alpine
