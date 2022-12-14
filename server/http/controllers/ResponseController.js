const elomiaAiServicesClient = require('../../components/services/Elomia/clients/aiServicesClient');

/**
 * Empathy controller
 */
class ResponseController {

    /**
     * Creates empathy
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    static async create(req, res) {

        try {


            let response = await elomiaAiServicesClient.getResponseFor(req.body.conversation);

            return res.send({
                success: true,
                type: 'RESPONSE',
                response: {
                    text: response.text
                }
            });

        } catch (e) {
            console.log(`EmpathyController error, `, e);
            return res.status(500).json({
                success: false,
                type: 'INTERNAL_ERROR',
                error: e.message
            });
        }
    }
}

module.exports = ResponseController;