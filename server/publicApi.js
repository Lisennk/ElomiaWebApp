const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
});

app.use('/conversation', require('./http/routes/conversationRoutes'));
app.use('/classification', require('./http/routes/classificationRoutes'));
app.use('/selfAnalysis', require('./http/routes/selfAnalysisRoutes'));

const port = config.get('server.port');
server.listen(port, () => console.log(`Public API app listening on port ${port}!`))
