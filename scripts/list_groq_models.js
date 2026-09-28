const https = require('https');

const req = https.request(
  'https://api.groq.com/openai/v1/models',
  {
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY || ''}`,
    },
  },
  (res) => {
    let body = '';
    res.on('data', (d) => (body += d));
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        if (json.data) {
          console.log('Available Groq Models:');
          json.data.forEach((m) => console.log(' -', m.id));
        } else {
          console.log('Response:', json);
        }
      } catch (e) {
        console.error(body);
      }
    });
  }
);
req.on('error', console.error);
req.end();
