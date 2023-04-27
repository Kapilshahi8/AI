import { Configuration, OpenAIApi } from "openai";
import { themeUserDetails } from "./helper/theme";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function askToAI(ques){
  const query = await openai.createCompletion({
    model: process.env.MODEL_NAME,
    prompt: ques,
    max_tokens: 2000,
    temperature: 0.1,
  })
  return query
}

const response = {
  message:{
    time:null,
    menuItem:null,
    subjectLine:null,
    emailBody:null
  },
  status:false
}

function trimAnswer(text){
  return text
  .replaceAll('ChatGPT Answer |','')
  .replaceAll('|', '')
  .replaceAll('\n\n', '')
  .replaceAll('.', '')
  .replaceAll('than the "menu_item"', '')
  .replaceAll(' than the menu item', '')
  .replaceAll(' or other comments','')
  .replaceAll('Subject Line: ','')
  .replaceAll('Email Body:', '')
  .replaceAll('Email Body: ', '')
}

function whatWouldBeThePurpose(goalTask){
  let purpose:string = '';
  switch (goalTask) {
    case '1':
      purpose = `Promote Menu Item`;
      break;
    case '2':
      purpose = `Take user to website`;
      break;
    default:
      purpose = '';
      break;
  }
  return purpose;
}

export async function askTime(req){
  let whatTimeAI = `${themeUserDetails.headerLine.replace('Business_Name', reviewPrompt(req.body.business_name) )
  .replace('Business_Website',reviewPrompt(req.body.business_website))
  .replace('Business_Type',reviewPrompt(req.body.businessType))} . 
  Now your task is to decide the date and time you will send a marketing email to customers in the next 7 days.
  The goal of the marketing email is "${whatWouldBeThePurpose(req.body.goal_Task)}".
  In your response only provide one date and time in the format hh:mm:ss. 
  
  Start and end your precise answer in this format "ChatGPT Answer |hh:mm:ss|" and do not include any additional information`;

  let responseAI = await askToAI(whatTimeAI);
  return trimAnswer(responseAI.data.choices[0].text)
}

export async function findTheMenuItem(req){
  let ask = `${themeUserDetails.headerLine.replace('Business_Name', reviewPrompt(req.body.business_name) )
  .replace('Business_Website',reviewPrompt(req.body.business_website))
  .replace('Business_Type',reviewPrompt(req.body.businessType))} . 

  Now your task is to find a "menu_item" to promote in a marketing email that will be sent at "${response.message.time}"

  The goal of the marketing email is "${whatWouldBeThePurpose(req.body.goal_Task)}".
  In your response only provide only one "menu_item" by looking up items on this page "business_menu". 
  Start and end your precise answer in this format "ChatGPT Answer |menu_item|" and do not include any more information`
  console.log('menu item ask',ask)
  let waitResponse = await askToAI(ask);
  return (trimAnswer(waitResponse.data.choices[0].text));
}

export async function generateSubjectLine(req) {
  
  let ask = `${themeUserDetails.headerLine.replace('Business_Name', reviewPrompt(req.body.business_name) )
  .replace('Business_Website',reviewPrompt(req.body.business_website))
  .replace('Business_Type',reviewPrompt(req.body.businessType))} .
  Now your task is to decide a "subject_line" of a marketing email that will be sent at "${response.message.time}"
  The goal of the marketing email is "${whatWouldBeThePurpose(req.body.goal_Task)}" called "${response.message.menuItem}"
  ${req.body.feedBack} 
  In your response only provide only one subject line with a character limit of 60 characters. 
  Start and end your precise answer in this format "ChatGPT Answer |subject_line|" and do not incude any more information
  `
  let waitResponse = await askToAI(ask);
  return (trimAnswer(waitResponse.data.choices[0].text));
}

export async function generateEmailBody(req){
  let ask = `${themeUserDetails.headerLine.replace('Business_Name', reviewPrompt(req.body.business_name) )
  .replace('Business_Website',reviewPrompt(req.body.business_website))
  .replace('Business_Type',reviewPrompt(req.body.businessType))} .
  Your task is to create "email_body" (i.e. body of the email for a marketing email) with the subject line "${response.message.subjectLine}" that will be sent at "${response.message.time}"
  The goal of the marketing email is "${whatWouldBeThePurpose(req.body.goal_Task)}" called "${response.message.menuItem}"
  Follow each of the below rules in your task
  1. Do not include any information about who the email is addressed to and who it is from
  2. Limit your response to 300 characters max
  ${req.body.feedback}. 
  
  Start and end your precise response to create "email_body" in this format "ChatGPT Answer |email_body|"
  `
  let waitResponse = await askToAI(ask);
  
  console.log('email body ask ',ask);

  return (trimAnswer(waitResponse.data.choices[0].text));
}

export default async function (req, res){
  
  response.message.time =  await askTime(req);
  response.message.menuItem = await findTheMenuItem(req);

  response.message.subjectLine = await generateSubjectLine(req);

  req.body.oldResponseArray.length > 0 && req.body.oldResponseArray.forEach( async element => {
    if(element.result.message.subjectLine === await generateSubjectLine(req)){
      console.log('subject line match');
    }
  });
  
  response.message.emailBody = await generateEmailBody(req);

  response.status = true
  res.status(200).json({ result: response });
}

function reviewPrompt(ask) {
  return `${ask}`;
}