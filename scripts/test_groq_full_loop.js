const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

async function runLoop() {
  const messages = [
    {
      role: 'system',
      content:
        'You are the MONOMER AI Investigator analyzing Case INV-DEMO-2026-001 (Operation Broken Fan). The primary target wallet being investigated is "suspect" (0x7A92d044e1837bF2D). Use available tools to investigate and answer.',
    },
    { role: 'user', content: 'Where did the money go?' },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'get_wallet_transactions',
        description: 'Get transactions for suspect',
        parameters: { type: 'object', properties: { walletId: { type: 'string' } }, required: ['walletId'] },
      },
    },
  ];

  console.log('Sending initial query with case context...');
  const res1 = await client.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages,
    tools,
  });

  const msg1 = res1.choices[0]?.message;
  console.log('Received response 1:', JSON.stringify(msg1, null, 2));

  if (msg1.tool_calls && msg1.tool_calls.length > 0) {
    messages.push({
      role: 'assistant',
      content: msg1.content || null,
      tool_calls: msg1.tool_calls,
    });

    for (const tc of msg1.tool_calls) {
      console.log('Executing tool:', tc.function.name, tc.function.arguments);
      messages.push({
        role: 'tool',
        tool_call_id: tc.id,
        content: JSON.stringify({
          walletId: 'suspect',
          transactions: [
            { id: 'TX-DEMO-002', to: 'walletB', amount: 800 },
            { id: 'TX-DEMO-003', to: 'walletC', amount: 700 },
            { id: 'TX-DEMO-004', to: 'walletD', amount: 500 },
          ],
        }),
      });
    }

    console.log('Sending tool output back to Groq...');
    const res2 = await client.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages,
      tools,
    });

    console.log('Final response from Groq:');
    console.log(res2.choices[0]?.message?.content);
  }
}

runLoop().catch(console.error);
