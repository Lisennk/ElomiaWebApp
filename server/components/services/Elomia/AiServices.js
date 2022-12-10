const axios = require('axios');
const mergeOptions = require('merge-options');
const config = require('config');
/**
 * Allows to access our AI services
 */
class AiServices {

    /**
     * Default options
     * @type {{api: {authorization: {password: *, username: *}, baseUrl: string, endpoints: {createMonologue: string, normalizeText: string, generalSafetyClassification: string, status: string}, version: number, requestTimeout}}}
     */
    defaultOptions = {
        api: {
            baseUrl: 'https://ai.api.elomia.com',
            version: 1,
            requestTimeout: 60 * 1000,
            endpoints: {
                createMonologue: '/conversation/monologue/create',
                normalizeText: '/text/normalize',
                getStatus: '/status',
                generalSafetyClassification: '/classification/text/safety/all/classify',
                createResponse: '/conversation/response/create'
            },
            authorization: {
                username: undefined,
                password: undefined
            }
        },
    }

    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        this.options = mergeOptions(this.defaultOptions, options);
        this.httpClient = this.getHttpClient(this.options.api);
    }

    /**
     * Returns http client
     */
    getHttpClient(options) {
        if (this.httpClient) return this.httpClient;

        const httpClient = axios.create();
        httpClient.defaults.timeout = options.timeout;
        httpClient.defaults.baseURL = options.baseUrl;
        httpClient.defaults.auth = options.authorization;
        return httpClient;
    }

    /**
     * Returns API health status
     * @returns {Promise<*>}
     */
    async getHealthStatus() {
        const result = await this.getHttpClient().get(this.options.api.endpoints.getStatus);
        return result.data;
    }

    /**
     * Normalizes conversation
     * @param conversation
     * @returns {*}
     */
    getNormalizedConversation(conversation) {
        return  conversation.sort((a,b) => {
            return a.createdAt - b.createdAt
        });
    }

    /**
     * Returns monologue from conversartion
     * @param conversation
     * @param options
     * @returns {Promise<*>}
     */
    async getMonologueFrom(conversation, options) {
        const defaultOptions = {
            maxLength: 1500,
            maxResponseUtterances: 999999999999, // Use some big number since we can't use Infinity
            structure: {
                questionRole: 'bot',
                responseRole: 'user',
            },
            preprocessing: {
                turnMultipleResponseUtterancesIntoOne: true,
                removeAppeals: false,
                removeSentenceStarters: false,
                removeGratitudeSentences: false,
                removeGreetingSentences: false,
                turnIntoOneParagraph: true,
                fixPunctuation: false,
                transformContractions: false,
                removeEndingDot: false,
                removeQuestions: false,
                removeYesSentences: false,
                removeNoSentences: false,
                removeMaybeSentences: false,
            }
        };

        options = mergeOptions(defaultOptions, options);
        conversation = this.getNormalizedConversation(conversation);

        const httpClient = this.getHttpClient();

        const result = await httpClient.post(this.options.api.endpoints.createMonologue, {
            conversation,
            options
        });

        return result.data.monologue;
    }

    /**
     * Returns normalized text
     * @param text
     * @param options
     * @returns {Promise<*>}
     */
    async getNormalizedText(text, options = {}) {
        const httpClient = this.getHttpClient();
        const result = await httpClient.post(this.options.api.endpoints.normalizeText, {
            text
        });

        return result.data.text;
    }

    /**
     * Returns safety classification results
     * @param text
     * @param options
     * @param maxLength
     * @returns {Promise<*>}
     */
    async getGeneralSafetyClassificationResults(text, options = {}, maxLength = 1950) {
        const httpClient = this.getHttpClient();
        text = text.slice(0, maxLength);

        const result = await httpClient.post(this.options.api.endpoints.generalSafetyClassification, {
            text,
            options
        });

        return result.data;
    }

    /**
     * Returns monologue from conversartion
     * @param conversation
     * @param options
     * @returns {Promise<*>}
     */
    async getResponseFor(conversation, options) {
        conversation = this.getNormalizedConversation(conversation);

        const httpClient = this.getHttpClient();

        const result = await httpClient.post(this.options.api.endpoints.createResponse, {
            conversation,
            options
        });

        return result.data.response;
    }

}

module.exports = AiServices;
