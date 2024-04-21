const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');


const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    
  },
  otp: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,

  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, 
  },
});

async function sendVerificationEmail(email, otp) {
  // console.log(email)
  if(email) {
    try {
      const mailResponse = await mailSender(
        email,
        'Verification Email',
        `<h1>Please confirm your OTP</h1>
         <p>Here is your OTP code: ${otp}</p>`
      );
      console.log('Email sent successfully: ', mailResponse);
    } catch (error) {
      console.log('Error occurred while sending email: ', error);
      throw error;
    }
  }
 
}
// send email

otpSchema.pre('save', async function (next) {
  console.log('New document saved to the database');
  // Only send an sms when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
    // await sendSMS(this.phone,this.otp)
  }
  next();
});
module.exports = mongoose.model('OTP', otpSchema);
