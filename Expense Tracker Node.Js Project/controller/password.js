const Sib = require('sib-api-v3-sdk')
require('dotenv').config()




exports.resetPassword = async (req, res, next) => {
    console.log(req.body)

    try {

        if (!process.env.API_KEY) {
            throw new Error('API_KEY is not set in environment variables');
        }

        const client = Sib.ApiClient.instance
        const apiKey = client.authentications['api-key']
        apiKey.apiKey = process.env.API_KEY

        const tranEmailApi = new Sib.TransactionalEmailsApi()
        const sender = {
            email: 'puransinghrana080@gmail.com',
            name: 'puran'
        }
        const receivers = [{ email: req.body.email }]
        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Link for the reset',
            textContent: "click here for reset"
        })

        console.log("Email sent successfully:", response);
        res.status(200).json({ message: "Reset email sent successfully" });

    } catch(error) {
        console.error('Error in sending email:', error);
        res.status(500).json({ message: 'Failed to send reset email', error });
    }


}