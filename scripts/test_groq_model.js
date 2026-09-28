const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

async function testModel(modelName) {
  console.log(`Testing model: ${modelName}...`);
  try {
    const res = await client.chat.completions.create({
      model: modelName,
      messages: [{ role: 'user', content: 'Respond with OK if you receive this.' }],
      max_tokens: 10,
    });
    console.log(`Success with ${modelName}:`, res.choices[0]?.message?.content);
    return true;
  } catch (err) {
    console.error(`Failed with ${modelName}:`, err.message);
    return false;
  }
}

async function main() {
  const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'groq/compound-mini'];
  for (const m of models) {
    const ok = await testModel(m);
    if (ok) {
      console.log(`===> Recommended model: ${m}`);
      break;
    }
  }
}

main();
