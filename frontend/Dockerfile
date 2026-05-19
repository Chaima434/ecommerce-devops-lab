FROM node:20-alpine AS construction
WORKDIR /application
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=construction /application/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
