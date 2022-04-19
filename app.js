import mu from 'mu';

const app = mu.app;
const bodyParser = require('body-parser');
const cors = require('cors');

const LOG_INCOMING_DELTA = isTruthy(process.env.LOG_INCOMING_DELTA || true);

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cors());


app.post('/delta', async function( req, res ) {
  const delta = req.body;

  if (LOG_INCOMING_DELTA) {
    console.log(`Receiving delta ${JSON.stringify(delta)}`);
  }
  res.status(202).send();
});

function isTruthy(value) {
  return [true, 'true', 1, '1', 'yes', 'Y', 'on'].includes(value);
}