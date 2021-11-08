#/bin/sh
echo "helm uninstall chart"
helm uninstall chart
echo "cd ../backend"
cd ../backend
echo "npm install"
npm install
echo "tsc"
tsc
echo "docker build . -t backend"
docker build . -t backend
echo "---Backend built---"
echo "cd ../frontend"
cd ../frontend
echo "npm install"
npm install

echo "npm run build"
npm run build
echo "docker build . -t frontend"
docker build . -t frontend
echo "---Frontend built---"

docker tag frontend baodinh/frontend:1.0.3
docker push baodinh/frontend:1.0.3

docker tag backend baodinh/backend:1.0.3
docker push baodinh/backend:1.0.3

