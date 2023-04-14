import data from './json/emailDesign1.json';
import { Configuration, OpenAIApi } from "openai";

function trimAnswer(text){
    return text
    .replaceAll('ChatGPT Answer |','')
    .replaceAll('|', '')
    .replaceAll('\n\n', '')
    .replaceAll('.', '')
    .replaceAll('than the "menu_item"', '')
    .replaceAll(' than the menu item', '')
    .replaceAll(' or other comments','')
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

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

const askToAI = async (ques) =>{
    const query = await openai.createCompletion({
      model: process.env.MODEL_NAME,
      prompt: ques,
      max_tokens: 2000,
      temperature: 0.6,
    })
    return query
  }

module.exports = {
    emailTemplate1: function(input) {
        return data;
    },
    emailTemplate2: function(input) {

    }
};

export{trimAnswer, response, openai, askToAI}