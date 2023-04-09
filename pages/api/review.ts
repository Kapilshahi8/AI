import { Configuration, OpenAIApi } from "openai";
import { themeUserDetails } from "../helper/theme";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res){
  const assigningUserAsAManager = await openai.createCompletion({
    model: process.env.MODEL_NAME,
    prompt: `Assume you are a marketing manager for "${themeUserDetails.brandName}".`,
    max_tokens: 2000,
    temperature: 0.6,
  })

  console.log(`Response From : AI  ${assigningUserAsAManager.data.choices[0]}`);

  const givingInformation = await openai.createCompletion({
    model: process.env.MODEL_NAME,
    prompt: `"${themeUserDetails.brandName}" is a "${themeUserDetails.brandType}" and details for same can be found here"${themeUserDetails.brandURL}"`,
    max_tokens: 2000,
    temperature: 0.6,
  })

  
  console.log(`next Response From : AI  ${givingInformation.data.choices[0]}`);

  const givingTask = await openai.createCompletion({
    model: process.env.MODEL_NAME,
    prompt: `Your task is to create "email_body" (i.e. body of email for a marketing email with the subject line "Try Our New Spicy Pork Tacos and More at Taqueria El Futuro! "
    Follow each of below rules in your task
    1. Do not include any information about who email is addressed to and who it is from
    2. Suggest an attractive subject in just 70 characters.
    3. Find the menu text from ${themeUserDetails.brandURL} and return it's href.
    4. Limit your response to 300 characters max.
    `,
    max_tokens: 2000,
    temperature: 0.6,
  })

  let splitResponse = givingTask.data.choices[0].text.split('\n\n')

  res.status(200).json({ result: splitResponse });
  
}

function reviewPrompt(ask) {
  return `${ask}`;
}