import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/verify-khalti', async (req, res) => {
  const { token, amount } = req.body;

  try {
    const response = await axios.post('https://khalti.com/api/v2/payment/verify/', {
      token,
      amount,
    }, {
      headers: {
        Authorization: 'Key test_secret_key_xxxxxx', // replace with your actual secret key
      },
    });

    // You can update appointment status here if needed
    return res.status(200).json({ success: true, data: response.data });

  } catch (err) {
    console.error('Khalti verification error:', err.response?.data || err.message);
    return res.status(400).json({ success: false, message: 'Verification failed' });
  }
});

export default router;
