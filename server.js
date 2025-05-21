require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

app.post('/send-sms', async (req, res) => {
  const { to, body } = req.body;
  if (!to || !body) {
    return res.status(400).json({ success: false, error: 'Missing "to" or "body"' });
  }
  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    res.json({ success: true, sid: message.sid });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`SMS backend running on port ${PORT}`));
