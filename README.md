# AWS CI/CD Capstone

End-to-end delivery lab for a containerized Node.js application using GitHub, CodePipeline, CodeBuild, Amazon ECR, ECS Fargate, CodeDeploy Blue/Green deployments, an Application Load Balancer, CloudWatch and SNS.

> Status: repository starter implementation. AWS infrastructure is not yet provisioned. Do not claim a live deployment until the public ALB endpoint and pipeline execution are verified.

## Endpoints
- GET /: responsive landing page.
- GET /health: health-check endpoint.
- GET /ready: readiness endpoint.
- GET /api/info: non-sensitive app metadata.
- Other paths return JSON 404.

## Run locally
Requires Node.js 20+ and npm.

```bash
cd src
npm install
npm test
npm start
```
Open http://localhost:3000 and verify http://localhost:3000/health.

Build and run Docker:

```bash
docker build -t aws-cicd-capstone:local .
docker run --rm -p 3000:3000 aws-cicd-capstone:local
```

## Target delivery flow
1. GitHub source change triggers CodePipeline.
2. CodeBuild installs dependencies, runs Jest tests, builds the image and pushes a commit-tagged image to ECR.
3. Pipeline artifacts provide image details, task definition template and CodeDeploy AppSpec.
4. CodeDeploy deploys to ECS Fargate using a Blue/Green deployment group and ALB target groups.
5. A manual approval action gates production deployment.
6. CloudWatch alarms monitor service/deployment health; SNS sends email notifications.

## AWS prerequisites
Configure an ECR repository named myapp-repo; ECS cluster and Fargate service using the CodeDeploy deployment controller; ALB listener and two target groups; task execution and task roles; CodeDeploy application/deployment group; CodeBuild project with Docker support and least-privilege ECR permissions; CloudWatch log group /ecs/myapp-task; CloudWatch alarms; SNS topic with confirmed email subscription; and CodePipeline GitHub source connection with a manual approval action.

Set CodeBuild environment variables AWS_DEFAULT_REGION and ECR_REPOSITORY=myapp-repo. Replace the role ARN and region placeholders in taskdef.json before deployment. Never commit credentials or secrets.

Important: ECS Blue/Green via CodeDeploy requires a CodeDeploy-controlled ECS service, ALB target groups/listener and a compatible AppSpec/task definition. It is not the same as the standard CodePipeline ECS deploy action that consumes imagedefinitions.json. Configure the pipeline action to match the Blue/Green architecture.

## Cost and security
Fargate tasks, public ALB, NAT gateways, logs and data transfer can incur charges. Check AWS pricing and budgets before provisioning and delete resources after assessment if no longer needed. Use IAM roles, not long-lived AWS keys.

## Submission evidence checklist
- Public repository URL and architecture diagram.
- Successful unit tests and CodeBuild logs.
- ECR image with commit tag.
- CodePipeline execution showing source, build, approval and deployment.
- ECS service and CodeDeploy deployment group.
- Public ALB URL showing the app and /health endpoint.
- CloudWatch alarm and SNS email confirmation.
