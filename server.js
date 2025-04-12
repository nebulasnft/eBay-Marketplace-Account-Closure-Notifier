const bodyParser = require('body-parser');
const { createHash } = require('crypto');
const express = require('express');
require('dotenv').config();

const app = express();

// Use the body parser middleware to parse the request body as JSON
app.use(bodyParser.json());

// Load environment variables
const verificationToken = process.env.VERIFICATION_TOKEN; // Verification token identical to the one supplied to eBay
const endpoint = process.env.ENDPOINT; // Endpoint URL for this server
const SUCCESS_STATUS = 200;
const BAD_REQUEST_STATUS = 400;

// Function to create a hashed response for eBay's verification
function createHashedResponse(challengeCode) {
  const hash = createHash('sha256');
  hash.update(challengeCode);       // Challenge code sent by eBay
  hash.update(verificationToken);   // Your verification token
  hash.update(endpoint);            // The endpoint URL
  return Buffer.from(hash.digest('hex')).toString();
}

// Default route for testing
app.get('/', (_, res) => {
  console.log('GET /');
  res.status(SUCCESS_STATUS).send('Hello World!');
});

// Route for eBay to verify the endpoint
app.get('/ebay', (req, res) => {
  console.log('GET /ebay');
  const challengeCode = req.query.challenge_code;

  if (!challengeCode) {
    return res.status(BAD_REQUEST_STATUS).send('Missing challenge code');
  }

  const responseHash = createHashedResponse(challengeCode);
  console.log('Challenge code:', challengeCode);
  console.log('Response hash:', responseHash);

  res.setHeader('Content-Type', 'application/json');
  res.status(SUCCESS_STATUS).json({ challengeResponse: responseHash });
});

// Route for eBay to send notifications
app.post('/ebay', (req, res) => {
  console.log('POST /ebay');
  console.log(req.body?.notification?.data?.username); // Example log
  res.status(SUCCESS_STATUS).send('POST /ebay');
});

// Use a standard HTTP port for Render (will expose this over HTTPS automatically if needed)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
