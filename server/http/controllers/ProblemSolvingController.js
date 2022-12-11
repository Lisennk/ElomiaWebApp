const AwarenessBlock = require('../../components/AwarenessBlock');
const SupportBlock = require('../../components/SupportBlock');
const ImprovementBlock = require('../../components/ImprovementBlock');
const PersonalizeQuestion = require('../../components/PersonalizeQuestion');

/**
 * Empathy controller
 */
class ProblemSolvingController {

    /**
     * Creates empathy
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    static async create(req, res) {

        try {

            const text = req.body.text.trim();

            return res.send({
                success: true,
                type: 'SELF_ANALYSIS_STEPS',
                data: {
                    awarenessBlock: await AwarenessBlock.getQuestions(text),
                    supportBlock: await SupportBlock.getQuestions(text),
                    improvementBlock: await ImprovementBlock.getQuestions(text)
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

    static async personalize(req, res) {
        const data = await PersonalizeQuestion.getPersonalizedQuestion(req.body.question, req.body.chatHistory);

        return res.send({
            success: true,
            type: 'PERSONALIZED_QUESTION',
            data
        });
    }
}

module.exports = ProblemSolvingController;