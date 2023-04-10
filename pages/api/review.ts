import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function askToAI(ques){
  const query = await openai.createCompletion({
    model: process.env.MODEL_NAME,
    prompt: ques,
    max_tokens: 2000,
    temperature: 0.6,
  })
  return query
}

export default async function (req, res){

  const assigningUserAsAManager = await askToAI(`Assume you are a marketing manager for "${reviewPrompt(req.body.brandName)}".`);

  console.log(`Vacant the position to : AI  ${assigningUserAsAManager.data.choices[0].text}`);

  const askTypeOfCompany = await askToAI(`which of type of business this company deal read this website ${req.body.brandURL} in three word`);
  
  console.log(`Company Type : AI  ${askTypeOfCompany.data.choices[0].text}`);

  const givingTask = await askToAI(`Your task is to create "email_body" for ${askTypeOfCompany.data.choices[0].text} (i.e. body of email for promoting the store with the subject line.
    Follow each of below rules in your task
    1. Do not include any information about who email is addressed to and who it is from
    2. Suggest an attractive subject in a new line with just 70 characters.
    3. Find the menu text from ${req.body.brandURL} and return it's href.
    4. ${ (req.body.feedback !== '') ? req.body.feedback : ''  }
    5.. Limit your response to 300 characters max.
    `);

  let splitResponse = givingTask.data.choices[0].text.split('\n\n')

  res.status(200).json({ result: splitResponse });
  
}

function reviewPrompt(ask) {
  return `${ask}`;
}