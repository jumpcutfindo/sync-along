#/bin/sh
echo "helm uninstall chart"
helm uninstall chart
echo "cd ~/cs3219-project-ay2122-2122-s1-g6/backend"
cd ~/cs3219-project-ay2122-2122-s1-g6/backend
echo "npm install"
npm install
echo "tsc"
tsc
echo "docker build . -t backend"
docker build . -t backend
echo "---Backend built---"
echo "cd ~/cs3219-project-ay2122-2122-s1-g6/frontend"
cd ~/cs3219-project-ay2122-2122-s1-g6/frontend
echo "npm install"
npm install
echo "npm run build"
npm run build
echo "docker build . -t frontend"
docker build . -t frontend
echo "---Frontend built---"

docker tag frontend baodinh/frontend:latest
docker push baodinh/frontend:latest

docker tag backend baodinh/backend:latest
docker push baodinh/backend:latest

echo "cd ~/cs3219-project-ay2122-2122-s1-g6/sync-along"
cd ~/cs3219-project-ay2122-2122-s1-g6/sync-along
echo "helm install chart . -f values.yaml"
echo "Helm chart built"

