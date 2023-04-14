import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

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
    .replaceAll('Subject Line: ', '')
}

  async function askToAI(ques){
    const query = await openai.createCompletion({
      model: process.env.MODEL_NAME,
      prompt: ques,
      max_tokens: 2000,
      temperature: 0.6,
    })
    return query
  }

async function feebackUserToAIForGenerateANewEmailBody(req){
    response.message.menuItem = JSON.parse(req.body.oldAiResponse).result.message.menuItem;
    response.message.time = JSON.parse(req.body.oldAiResponse).result.message.time;
    response.message.subjectLine = JSON.parse(req.body.oldAiResponse).result.message.subjectLine;
    response.message.emailBody = JSON.parse(req.body.oldAiResponse).result.message.emailBody;
    let say = `Read ${response.message.emailBody} and
    Send me another "email_body" and consider this feedback "${reviewPrompt(req.body.feedback)}"`;
    let waitResponse = await askToAI(say);
    return (trimAnswer(waitResponse.data.choices[0].text));
}

async function feebackUserToAIForGenerateANewSubjectLine(req){
    response.message.menuItem = JSON.parse(req.body.oldAiResponse).result.message.menuItem;
    response.message.time = JSON.parse(req.body.oldAiResponse).result.message.time;
    response.message.subjectLine = JSON.parse(req.body.oldAiResponse).result.message.subjectLine;
    response.message.emailBody = JSON.parse(req.body.oldAiResponse).result.message.emailBody;
    let say = `Read ${response.message.subjectLine} and
    Send me another "subject_line" and consider this feedback "${reviewPrompt(req.body.feedback)}"`;
    let waitResponse = await askToAI(say);
    return (trimAnswer(waitResponse.data.choices[0].text));
}

export default async function (req, res){
    switch (req.body.requestType) {
        case 'email_Body':
        response.message.emailBody =  await feebackUserToAIForGenerateANewEmailBody(req);
            break;
        case 'subject_line':
        response.message.subjectLine =  await feebackUserToAIForGenerateANewSubjectLine(req);
            break;
        case 'changeBoth' :
          response.message.subjectLine =  await feebackUserToAIForGenerateANewSubjectLine(req);
          response.message.emailBody =  await feebackUserToAIForGenerateANewEmailBody(req);
            break;  
        default:
            break;
    }
    
    response.status = true
    res.status(200).json({ result: response });
  }
  
function reviewPrompt(ask) {
    return `${ask}`;
}