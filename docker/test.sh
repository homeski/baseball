docker build -t homeski/haproxy haproxy/Dockerfile
docker build -t homeski/nodejs nodejs-helloworld/Dockerfile

docker run --name node-web-app -d homeski/nodejs
docker run --name haproxy -p 49160:80 --link node-web-app -d homeski/haproxy
