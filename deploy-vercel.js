const https = require('https');
const fs = require('fs');
const path = require('path');

const TOKEN = 'v1:yf6rUj6dS5RFqz5vJ8bjxiMp:KzKHZyM10H9JcBnNNbmereaH';

// Try different variations of the token
const tokens = [
  TOKEN,
  'yf6rUj6dS5RFqz5vJ8bjxiMp:KzKHZyM10H9JcBnNNbmereaH',
  'yf6rUj6dS5RFqz5vJ8bjxiMp',
  'KzKHZyM10H9JcBnNNbmereaH'
];

async function testToken(token) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.vercel.com',
      path: '/v2/user',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Token ${token.substring(0, 10)}... - Status: ${res.statusCode}`);
        if (res.statusCode === 200) {
          console.log('✅ Valid token found!');
          console.log('User data:', data);
        } else {
          console.log('❌ Invalid token');
          console.log('Response:', data);
        }
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  console.log('Testing Vercel tokens...\n');
  
  for (const token of tokens) {
    const isValid = await testToken(token);
    if (isValid) {
      console.log('\n🎉 Found working token!');
      console.log('Use this for deployment:', token);
      break;
    }
    console.log('');
  }
}

main();