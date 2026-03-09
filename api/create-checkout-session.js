import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],

      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.status(200).json({ url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

}
