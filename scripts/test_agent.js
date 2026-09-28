const http = require('http');

function testQuery(query, history = []) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query, conversationHistory: history });

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
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, json: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runAllTests() {
  console.log('=== TEST 1: Where did the money go? ===');
  const t1 = await testQuery('Where did the money go?');
  console.log('Status:', t1.status);
  console.log('Mode:', t1.json?.mode);
  console.log('Answer:\n', t1.json?.answer);
  console.log('Evidence:', t1.json?.evidenceIds);
  console.log('Transactions:', t1.json?.transactionIds);
  console.log('Tools Used:', t1.json?.toolsUsed);
  console.log('Agent Steps:', t1.json?.agentSteps);

  console.log('\n=== TEST 2: Why is Wallet C suspicious? ===');
  const t2 = await testQuery('Why is Wallet C suspicious?');
  console.log('Answer:\n', t2.json?.answer);
  console.log('Evidence:', t2.json?.evidenceIds);
  console.log('Focus Action:', t2.json?.focusAction);

  console.log('\n=== TEST 3: Show me the cross-chain movement ===');
  const t3 = await testQuery('Show me the cross-chain movement.');
  console.log('Answer:\n', t3.json?.answer);
  console.log('Focus Action:', t3.json?.focusAction);

  console.log('\n=== TEST 4: Why is this case high risk? ===');
  const t4 = await testQuery('Why is this case high risk?');
  console.log('Answer:\n', t4.json?.answer);
  console.log('Evidence:', t4.json?.evidenceIds);

  console.log('\n=== TEST 5: Contextual follow-up: What happened to the second wallet? ===');
  const t5 = await testQuery('What happened to the second wallet?', [
    { sender: 'user', content: 'Where did the money go?' },
    { sender: 'assistant', content: t1.json?.answer || '' },
  ]);
  console.log('Answer:\n', t5.json?.answer);
  console.log('Focus Action:', t5.json?.focusAction);

  console.log('\n=== TEST 6: Unsupported: Who owns this wallet in real life? ===');
  const t6 = await testQuery('Who owns this wallet in real life?');
  console.log('Answer:\n', t6.json?.answer);
}

runAllTests().catch(console.error);
