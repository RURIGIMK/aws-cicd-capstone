FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY src/package.json ./package.json
RUN npm install --omit=dev --no-audit --no-fund
COPY src/app.js ./app.js
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD node -e "require('http').get('http://127.0.0.1:3000/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node","app.js"]
