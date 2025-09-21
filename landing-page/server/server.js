const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_AUDIENCE_ID = 'dfc2ef175c';
const MAILCHIMP_SERVER_PREFIX = 'us13'; // e.g., 'us1', 'us2'

app.use(cors());
app.use(bodyParser.json());

app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await axios.post(
      `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`,
      {
        email_address: email,
        status: 'subscribed',
      },
      {
        headers: {
          Authorization: `apikey ${MAILCHIMP_API_KEY}`,
        },
      }
    );

    res.status(200).json({ message: 'Subscription successful', data: response.data });
  } catch (error) {
    res.status(500).json({ error: 'Subscription failed', details: error.response.data });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
