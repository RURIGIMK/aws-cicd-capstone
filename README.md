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
3. The build artifact contains `imageDetail.json`, `taskdef.json`, and `appspec.yaml` for ECS Blue/Green deployment.
4. A manual approval action gates the production deployment.
5. CodeDeploy deploys to ECS Fargate using a Blue/Green deployment group and ALB target groups.
6. CloudWatch alarms monitor service/deployment health; SNS sends email notifications.

## AWS prerequisites
Configure an ECR repository named `myapp-repo`; an ECS cluster and Fargate service using the CodeDeploy deployment controller; an ALB listener and two target groups; an ECS task execution role and task role (or permitted Academy-provided role); a CodeDeploy application/deployment group; a CodeBuild project with Docker support and ECR permissions; CloudWatch log group `/ecs/myapp-task`; CloudWatch alarms; an SNS topic with confirmed email subscription; and a CodePipeline GitHub source connection with a manual approval action.

Set CodeBuild environment variables `AWS_DEFAULT_REGION` and `ECR_REPOSITORY=myapp-repo`. Replace the role ARN and region placeholders in `taskdef.json` with values available in your lab before deployment. The CodeDeploy AppSpec uses `TaskDefinition: <TASK_DEFINITION>`; the ECS Blue/Green deploy action replaces that placeholder. In the deploy action, set the AppSpec file to `appspec.yaml`, the task definition file to `taskdef.json`, and the image container placeholder to `IMAGE1_NAME`, matching the image field in `taskdef.json`.

Never commit credentials or secrets.

Important: ECS Blue/Green via CodeDeploy requires a CodeDeploy-controlled ECS service, ALB target groups/listener and a compatible AppSpec/task definition. It is not the same as the standard CodePipeline ECS deploy action that consumes `imagedefinitions.json`. Configure the pipeline action to match the Blue/Green architecture. For the Blue/Green deploy action, use `imageDetail.json` as the build output image artifact.

## Cost and security
Fargate tasks, a public ALB, NAT gateways, logs and data transfer can incur charges. Check your available lab budget before provisioning. Avoid a NAT gateway where the design can use public subnets with tightly scoped security groups for a demo. Use IAM roles, not long-lived AWS keys. Delete billable resources after assessment if your instructor permits.

## Submission evidence checklist
- Public repository URL and architecture diagram (PNG required by the assignment).
- Successful unit tests and CodeBuild logs.
- ECR image with commit tag.
- CodePipeline execution showing source, build, approval and deployment.
- ECS service and CodeDeploy deployment group.
- Public ALB URL showing the app and `/health` endpoint.
- CloudWatch alarm and SNS email confirmation.
