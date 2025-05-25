# 개발 환경
FROM node:18 as development
WORKDIR /app
COPY package*.json ./
RUN npm install
# react-scripts 버전 문제 해결
RUN npm install react-scripts@4.0.3
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# 프로덕션 빌드
FROM node:18 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 프로덕션 환경
FROM nginx:alpine as production
COPY --from=build /app/build /usr/share/nginx/html
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 