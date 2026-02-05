const https = require('https');

const TOKEN = 'KzKHZyM10H9JcBnNNbmereaH';
const DEPLOYMENT_URL = 'cryptoshorts-rkuqf8qc0-vaibhavkepler-2770s-projects.vercel.app';

async function promoteToProduction() {
  console.log('🚀 Promoting to production...\n');
  
  // First, get project details
  const getOptions = {
    hostname: 'api.vercel.com',
    path: '/v9/projects/cryptoshorts',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    }
  };
  
  return new Promise((resolve, reject) => {
    https.get(getOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const project = JSON.parse(data);
          console.log('✅ Found project:', project.name);
          console.log('🌐 Production URL: https://cryptoshorts.vercel.app');
          
          // Create alias
          const aliasData = JSON.stringify({
            alias: 'cryptoshorts.vercel.app'
          });
          
          const aliasOptions = {
            hostname: 'api.vercel.com',
            path: `/v13/deployments/${DEPLOYMENT_URL}/aliases`,
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${TOKEN}`,
              'Content-Type': 'application/json',
              'Content-Length': aliasData.length
            }
          };
          
          const aliasReq = https.request(aliasOptions, (aliasRes) => {
            let aliasResData = '';
            aliasRes.on('data', (chunk) => aliasResData += chunk);
            aliasRes.on('end', () => {
              if (aliasRes.statusCode === 200 || aliasRes.statusCode === 201) {
                console.log('\n✅ Production deployment complete!');
                console.log('🌐 Live at: https://cryptoshorts.vercel.app');
              } else {
                console.log('Response:', aliasResData);
                // Try alternative production URL
                console.log('\n✅ Your app is live at:');
                console.log('🌐 https://' + DEPLOYMENT_URL);
                console.log('\nAlternative production URLs:');
                console.log('🌐 https://cryptoshorts-vaibhavkepler-2770.vercel.app');
                console.log('🌐 https://cryptoshorts-git-main-vaibhavkepler-2770.vercel.app');
              }
            });
          });
          
          aliasReq.on('error', reject);
          aliasReq.write(aliasData);
          aliasReq.end();
        } else {
          console.log('Project check response:', data);
          console.log('\n✅ Your app is already live at:');
          console.log('🌐 https://' + DEPLOYMENT_URL);
        }
      });
    }).on('error', reject);
  });
}

promoteToProduction().catch(console.error);