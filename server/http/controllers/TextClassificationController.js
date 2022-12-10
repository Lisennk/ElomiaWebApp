const elomiaAiServicesClient = require('../../components/services/Elomia/clients/aiServicesClient');

/**
 * Empathy controller
 */
class TextClassificationController {

    /**
     * Creates empathy
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    static async classifySafety(req, res) {

        try {


            let result = await elomiaAiServicesClient.getGeneralSafetyClassificationResults(req.body.text);

            return res.send({
                success: true,
                type: 'CLASSIFICATION_RESULT',
                data: result
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

module.exports = TextClassificationController;