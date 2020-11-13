FROM node:14.10
EXPOSE 3001

# Install PM2
RUN npm install -g pm2

# Add source
ADD package.json .

# NPM Install
RUN npm install --production

ADD src src

CMD node src/index.js
