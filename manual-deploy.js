const fs = require('fs');
const path = require('path');
const https = require('https');

const TOKEN = 'KzKHZyM10H9JcBnNNbmereaH';
const PROJECT_NAME = 'cryptoshorts';

async function createDeployment() {
  console.log('🚀 Creating deployment on Vercel...\n');
  
  // Read all files from web-build directory
  const files = [];
  const webBuildPath = path.join(__dirname, 'web-build');
  
  function readDirRecursive(dir, baseDir = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(baseDir, item).replace(/\\/g, '/');
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        readDirRecursive(fullPath, relativePath);
      } else {
        files.push({
          file: relativePath,
          data: fs.readFileSync(fullPath, 'base64')
        });
      }
    });
  }
  
  readDirRecursive(webBuildPath);
  
  console.log(`Found ${files.length} files to deploy`);
  
  // Create deployment
  const deploymentData = JSON.stringify({
    name: PROJECT_NAME,
    files: files.map(f => ({
      file: f.file,
      data: f.data,
      encoding: 'base64'
    })),
    projectSettings: {
      framework: null
    },
    target: 'production'
  });
  
  const options = {
    hostname: 'api.vercel.com',
    path: '/v13/deployments',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': deploymentData.length
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          const result = JSON.parse(data);
          console.log('\n✅ Deployment created successfully!');
          console.log(`🌐 URL: https://${result.url}`);
          console.log(`📊 Status: ${result.readyState}`);
          resolve(result);
        } else {
          console.error('❌ Deployment failed');
          console.error(`Status: ${res.statusCode}`);
          console.error(`Response: ${data}`);
          reject(new Error(data));
        }
      });
    });
    
    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      reject(e);
    });
    
    req.write(deploymentData);
    req.end();
  });
}

createDeployment().catch(console.error);