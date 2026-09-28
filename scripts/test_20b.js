const http = require('http');

const data = JSON.stringify({
  query: 'Where did the money go?'
});

const req = http.request(
  'http://127.0.0.1:3000/api/ai/investigate',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  },
  (res) => {
    let body = '';
    res.on('data', (c) => (body += c));
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      try {
        const json = JSON.parse(body);
        console.log('Mode:', json.mode);
        console.log('Answer:\n', json.answer);
        console.log('Tools Used:', json.toolsUsed);
        console.log('Evidence:', json.evidenceIds);
      } catch (e) {
        console.log('Raw:', body);
      }
    });
  }
);

req.on('error', console.error);
req.write(data);
req.end();
