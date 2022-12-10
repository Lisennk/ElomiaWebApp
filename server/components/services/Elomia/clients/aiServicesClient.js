const config = require('config');
const AiServices = require('../AiServices');

module.exports = new AiServices({
    api: {
        authorization: config.get('elomiaAiServices.authorization')
    }
});