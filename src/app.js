const express = require('express');
const app = express();
const version = process.env.APP_VERSION || 'local';
app.disable('x-powered-by');
app.get('/', (_req,res) => res.status(200).type('html').send('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AWS CI/CD Capstone</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#101827;color:#edf2f7;font:16px system-ui}.panel{max-width:680px;margin:24px;padding:40px;border:1px solid #34445c;border-radius:18px;background:#172235}small{color:#67e8c0;letter-spacing:.14em}p{color:#bac7d9;line-height:1.7}</style><main class="panel"><small>AWS DELIVERY PIPELINE</small><h1>Hello from the CI/CD Capstone</h1><p>Containerized Node.js application designed for Amazon ECS Fargate behind an Application Load Balancer.</p><p>Pipeline: GitHub · CodeBuild · ECR · CodeDeploy Blue/Green</p><p>Version: '+escapeHtml(version)+'</p></main></html>'));
app.get('/health', (_req,res) => res.status(200).json({status:'ok',version}));
app.get('/ready', (_req,res) => res.status(200).json({status:'ready'}));
app.get('/api/info', (_req,res) => res.json({name:'aws-cicd-capstone',version,runtime:'node',deployment:'ecs-fargate'}));
app.use((_req,res) => res.status(404).json({error:'Not found'}));
function escapeHtml(v){return String(v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));}
if(require.main===module){const port=Number(process.env.PORT||3000);app.listen(port,'0.0.0.0',()=>console.log('Capstone app listening on '+port));}
module.exports=app;
