const http = require('http');

function ask(query) {
  return new Promise((resolve) => {
    const data = JSON.stringify({ query });
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
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve({ raw: body });
          }
        });
      }
    );
    req.on('error', (err) => resolve({ error: err.message }));
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('--- 1. Why is Wallet C suspicious? ---');
  const r1 = await ask('Why is Wallet C suspicious?');
  console.log('Mode:', r1.mode, '| Tools:', r1.toolsUsed, '| Evidence:', r1.evidenceIds, '| Focus:', r1.focusAction);
  console.log('Answer excerpt:', r1.answer?.slice(0, 200), '...\n');

  console.log('--- 2. Show me the cross-chain movement ---');
  const r2 = await ask('Show me the cross-chain movement.');
  console.log('Mode:', r2.mode, '| Tools:', r2.toolsUsed, '| Focus:', r2.focusAction);
  console.log('Answer excerpt:', r2.answer?.slice(0, 200), '...\n');

  console.log('--- 3. Why is this case high risk? ---');
  const r3 = await ask('Why is this case high risk?');
  console.log('Mode:', r3.mode, '| Tools:', r3.toolsUsed, '| Evidence:', r3.evidenceIds);
  console.log('Answer excerpt:', r3.answer?.slice(0, 200), '...\n');

  console.log('--- 4. Unsupported: Who owns this wallet in real life? ---');
  const r4 = await ask('Who owns this wallet in real life?');
  console.log('Mode:', r4.mode, '| Answer excerpt:', r4.answer?.slice(0, 200), '...\n');
}

run();
