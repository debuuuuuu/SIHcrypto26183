const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

async function testTools(model) {
  console.log('Testing tools with model:', model);
  try {
    const res = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: 'What is the case summary?' }],
      tools: [
        {
          type: 'function',
          function: {
            name: 'get_investigation_summary',
            description: 'Get case summary',
            parameters: { type: 'object', properties: {} },
          },
        },
      ],
      tool_choice: 'auto',
    });
    console.log('Success! Message:', res.choices[0]?.message);
  } catch (err) {
    console.error('Error with model:', model, err.message);
  }
}

testTools('openai/gpt-oss-120b');
testTools('openai/gpt-oss-20b');
testTools('qwen/qwen3.8-27b');
