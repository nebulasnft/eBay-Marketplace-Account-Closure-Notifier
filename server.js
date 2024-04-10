const bodyParser = require('body-parser');
const { createHash } = require('crypto');
const express = require('express');
const https = require('https');
const fs = require('fs');

require('dotenv').config()

const app = express();

// Use the body parser middleware to parse the request body as JSON
app.use(bodyParser.json());

// Load the environment variables
const verificationToken = process.env.VERIFICATION_TOKEN; // Verification token identical to the one supplied to Ebay
const endpoint = process.env.ENDPOINT; // The endpoint URL for this server. Include https://
const domain = process.env.DOMAIN; // The domain for this server AKA what the server is hosted on (what was typed into certbot)

const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const SUCCESS_STATUS = 200;
const BAD_REQUEST_STATUS = 400;

// Load the private key and certificate
// Create the private key and certificate using Certbot or another SSL certificate provider
// Certbot: https://certbot.eff.org/
const serverOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/' + domain + '/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/' + domain + '/fullchain.pem'),
};

// Function to create a hashed response for eBay's verification
// Source: https://developer.ebay.com/marketplace-account-deletion
function createHashedResponse(challengeCode) {
  const hash = createHash('sha256');

  hash.update(challengeCode); // The challenge code sent by eBay
  hash.update(verificationToken); // Verification token created yourself
  hash.update(endpoint); // The endpoint URL for this server

  // Convert the hash to a string
  const responseHash = hash.digest('hex');
  const hashString = new Buffer.from(responseHash).toString();

  return hashString;
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

  console.log('Challenge code:', challengeCode);

  if (!challengeCode) {
    return res.status(BAD_REQUEST_STATUS).send('Missing challenge code');
  }

  const responseHash = createHashedResponse(challengeCode);

  console.log('Response hash:', responseHash);

  // Response format required by eBay
  res.setHeader('Content-Type', 'application/json');
  res.status(SUCCESS_STATUS).json({ challengeResponse: responseHash });
});

// Route for eBay to send notifications
app.post('/ebay', (req, res) => {
  console.log('POST /ebay');

  // Log the notification data
  // TODO: Implement your own logic here to handle the notification data per eBay's requirements
  console.log(req.body?.notification.data.username);

  res.status(SUCCESS_STATUS).send('POST /ebay');
});

// Create an HTTPS server
// Ebay requires the endpoint to be HTTPS
https.createServer(serverOptions, app).listen(HTTPS_PORT);
