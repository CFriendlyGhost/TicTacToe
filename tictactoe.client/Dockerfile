FROM node:18-alpine
ARG API_KEY

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

RUN VITE_REACT_API_URL=${API_KEY} \
    npm run build

CMD [ "npm", "run", "preview" ]