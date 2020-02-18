$(aws ecr get-login --no-include-email --region ap-south-1 --profile fleet-aws)
docker build -t fleet-app .
docker tag fleet-app:latest 112567001577.dkr.ecr.ap-south-1.amazonaws.com/fleet-app:latest
docker push 112567001577.dkr.ecr.ap-south-1.amazonaws.com/fleet-app:latest