const express = require('express');
const stripe = require('stripe')('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'); // Replace with your secret key
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Route to create a PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body; // Extract data from the request body

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Smallest currency unit (e.g., cents for USD)
            currency: currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});


const PORT = 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
