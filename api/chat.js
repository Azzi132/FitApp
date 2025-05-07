const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY =
  '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';

export const sendMessage = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat:free',
        messages: [{ role: 'user', content: message }],
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
