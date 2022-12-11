const { Configuration, OpenAIApi } = require('openai');
const config = require('config');

const configuration = new Configuration({
    apiKey: config.get('openai.token'),
});
const openai = new OpenAIApi(configuration);

class SupportBlock {

    static async getPersonalizedQuestion(question, chatHistory) {
        try {

            let prompt = `The following is a transcript of a therapy session. Each therapist's message starts with an expression of empathy or an introduction to the question and ends with a question.`;

            chatHistory.forEach(message => {
                prompt += `\n\n${message.author === 'bot' ? 'Therapist:' : 'Patient:'} ${message.text}`
            });

            prompt += `\n\nTherapist:`;

            console.log(prompt, question);

            const response = await openai.createCompletion({
                model: 'text-davinci-003',
                temperature: 1,
                prompt: prompt,
                max_tokens: 256,
                n: 30,
                suffix: question,
            });

            const choices = response.data.choices.filter(choice => {
                return choice.finish_reason === 'stop' && choice.text.trim().length > 0 && !choice.text.includes('?') && !choice.text.includes('sounds') && !choice.text.includes('understand')
            });

            console.log(choices);

            if (choices.length > 0) {
                return choices[0].text.trim();
            } else {
                console.log(`No completions`);
                return '';
            }

        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = SupportBlock;