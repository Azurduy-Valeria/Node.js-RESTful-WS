## Commands to deploy the Docker application using minikube and Kubernetes

1.  Start minikube

    ` minikube start `

2. Manually load an image into your Minikube cluster's local Docker registry.

    ` minikube image load retrieve-lux-population-app `

3. Create the deployment based on deployment.yml

    ` kubectl apply -f deployment.yml `

4. Expose the application to access it from browser

    ` kubectl expose deployment retrieve-lux-population-app --type=NodePort --port=8000   ` 

5. Access the application

    ` minikube service retrieve-lux-population-app `

