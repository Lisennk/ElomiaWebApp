const { Configuration, OpenAIApi } = require('openai');
const config = require('config');

const configuration = new Configuration({
    apiKey: config.get('openai.token'),
});
const openai = new OpenAIApi(configuration);

class ImprovementBlock {

    static async getQuestions(text) {
        try {

            let questionsTranscript = ``;

            for (let i = 0; i < 3; i++) {
                const response = await openai.createCompletion({
                    model: 'davinci:ft-elomia:psm-2015-relevant-third-block-2eps-2022-12-10-16-16-55',
                    temperature: 0.9,
                    max_tokens: 500,
                    prompt: `${text}\n\n###`,
                    stop: ['END'],
                });

                questionsTranscript = response.data.choices[0].text.trim();

                console.log(`Attempt`, i);
                if (questionsTranscript.length >= 300 && questionsTranscript.length <= 1000) {
                    break;
                }
            }

            return questionsTranscript.split('\n').map(question => {
                return question.trim();
            });

        } catch (e) {
            console.log(e.response.data);
        }
    }
}

module.exports = ImprovementBlock;