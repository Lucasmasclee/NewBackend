const express = require('express');
const stripe = require('stripe')('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'); // Replace with your live secret key
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
            id: paymentIntent.id, // Include the ID in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});


// Route to confirm a PaymentIntent
app.post('/confirm-payment', async (req, res) => {
    try {
        const { clientSecret, paymentMethod } = req.body;

        // Confirm the PaymentIntent with the payment method
        const paymentIntent = await stripe.paymentIntents.confirm(clientSecret, {
            payment_method: paymentMethod,  // Directly pass the payment method object
        });

        res.status(200).send({
            status: paymentIntent.status,
            paymentIntent: paymentIntent,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

// Health check endpoint (optional, for testing server)
app.get('/', (req, res) => {
    res.send('Stripe Payment API is running.');
});

// Start the server
const PORT = 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
