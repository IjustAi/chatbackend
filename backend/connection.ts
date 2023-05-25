import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

type ResponseData = {
  text: string;
};

type ChatMessage = {
  role: 'system' | 'user';
  content: string;
};

const connect = new Configuration({
  apiKey: '',
});

const openai = new OpenAIApi(connect);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const prompt: string = req.body.prompt;
  //const previous: string = req.body.previous;
  if (!prompt) {
    res.status(400).json({ text: 'Please enter something' });
    return;
  }

  try {
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: "",
        //content：previous；
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const response = completion.data.choices[0].message?.content || 'ERROR';
    res.status(200).json({ text: response });
  } catch (error) {
    console.error('API request error', error);
    res.status(500).json({ text: 'API request error' });
  }
}
