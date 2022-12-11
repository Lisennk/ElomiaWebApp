const { Configuration, OpenAIApi } = require('openai');
const config = require('config');

const configuration = new Configuration({
    apiKey: config.get('openai.token'),
});
const openai = new OpenAIApi(configuration);

class SupportBlock {

    static async getQuestions(text) {
        try {

            const response = await openai.createCompletion({
                model: 'davinci:ft-elomia:psm-2015-relevant-second-block-2eps-2022-12-10-13-50-03',
                temperature: 0.9,
                max_tokens: 500,
                prompt: `${text}\n\n###`,
                stop: ['END'],
            });

            const questionsTranscript = response.data.choices[0].text.trim();
            return questionsTranscript.trim();

        } catch (e) {
            console.log(e.response.data);
        }
    }
}

module.exports = SupportBlock;