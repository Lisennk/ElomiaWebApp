const { ArgumentParser } = require('argparse');
const parser = new ArgumentParser({});
parser.add_argument('-m', '--message');

const arguments = parser.parse_args();
const userMessage = arguments.message.trim();

const { Configuration, OpenAIApi } = require('openai');
const config = require('config');

const configuration = new Configuration({
    apiKey: config.get('openai.token'),
});
const openai = new OpenAIApi(configuration);


let prefixes = [
    'The following is a transcript of a therapy session. The therapist helps the client deal with their problem by using CBT techniques, listening, and offering helpful advice.',
    'The following is a transcript of a therapy session.',
    'Conduct a 10-message therapy session and help the client deal with their problem. Use techniques from CBT and active listening.'
];

let models = [
    'text-davinci-002',
    'text-davinci-003'
];

let chatHistories = [
    `Patient: ${userMessage}\nTherapist:`,
    `Therapist: Hi, how can I help you?\nPatient: ${userMessage}\nTherapist:`,
    `Therapist: How have you been feeling?\nPatient: Bad\nTherapist: I'm sorry to hear that. Why do you feel bad?\nPatient: I’ve been very stressed lately\nTherapist: That makes sense. Stress can be tough to handle. What has been happening that has caused you stress?\nPatient: ${userMessage}`,
];

let prompt = `The following is a transcript of a therapy session.\n\nPatient: ${userMessage}\nTherapist:`;
let prompt2 = `The following is a transcript of a therapy session.\n\nPatient: ${userMessage}\nTherapist:`;

(async () => {

    console.log(`Message: ${userMessage}\n\n`);

    let messageOptions = [];

    for (let i = 0; i < models.length; i++) {
        const model = models[i];

        for (let k = 0; k < prefixes.length; k++) {
            const prefix = prefixes[k];

            for (let j = 0; j < chatHistories.length; j++) {
                const chatHistory = chatHistories[j];
                const prompt = `${prefix}\n\n${chatHistory}`;

                const responseSet = await openai.createCompletion({
                    model,
                    temperature: 1,
                    max_tokens: 500,
                    prompt,
                    stop: ['\n'],
                    n: 10
                });

                responseSet.data.choices.forEach(choice => {
                    if (choice.finish_reason !== 'stop') return;
                    let text = choice.text.trim();
                    if (!text) return;;

                    if (!messageOptions.includes(text)) {
                        messageOptions.push(text);
                        console.log(`${messageOptions.length}. ${text}\n`);
                    }
                });

            }
        }
    }


})();


