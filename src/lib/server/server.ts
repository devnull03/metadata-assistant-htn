import { COHERE_API_KEY } from "$env/static/private";


const { CohereClientV2 } = require('cohere-ai');
const cohere = new CohereClientV2({
  token: COHERE_API_KEY,
});
(async () => {
  const response = await cohere.chat({
    model: 'command-a-03-2025',
    messages: [
      {
        role: 'user',
        content: 'hello world!',
      },
    ],
  });
  console.log(response);
})();