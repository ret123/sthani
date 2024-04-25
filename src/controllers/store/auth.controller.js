const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { Vonage } = require('@vonage/server-sdk')
const otpGenerator = require('otp-generator');
const { User, OTP, Customer } = require('../../models');
const { customerService } = require('../../services/store');
const { tokenService } = require('../../services');

async function sendSMS(phone,otp) {
  console.log(phone)
  if(phone) {
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET
    })
    const from = 'Vonage APIs';
    const to = phone;
    const text = `Verifcation Code: ${otp}. Valid for 5 minutes `;
    await vonage.sms
      .send({ to, from, text })
      .then((resp) => {
        console.log('Message sent successfully');
        console.log(resp);
      })
      .catch((err) => {
        console.log('There was an error sending the messages.');
        console.error(err);
      });
  }
 
}

const sendOTP = catchAsync(async (req, res) => {
  
  try {
    const { email,phone
     } = req.body;
    let otpPayload;
    // Check if user is already present
    if(email) {
      const customer = await Customer.findOne({ email });
      // If user found with provided email
      if (customer) {
        const tokens = await tokenService.generateAuthTokens(customer);
        return res.status(401).json({
          customer,
          tokens,
          success: false,
          message: 'User is already registered',
        });
      }
    }
   
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    if(email) {
      otpPayload = { email, otp };
      const otpBody = await OTP.create(otpPayload);
    } 
    if(phone) {
    
      otpPayload = { phone, otp };
      const otpBody = await OTP.create(otpPayload);
      console.log(otpBody);
      await sendSMS(phone,otp)
    }
     

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});


const verifyOTP = catchAsync(async (req, res) => {
  const {otp,phone,email } = req.body;
  let response;
  try {
      if(email) {
        response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
      }
      if(phone) {
        response = await OTP.find({ phone }).sort({ createdAt: -1 }).limit(1);
      }
    
    
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid or expired',
      });
    } else {
      return res.status(200).json({
        success: true,
        message: 'The OTP is valid',
      });
    }

  } catch(err) {

  }
})


const register = catchAsync(async (req, res) => {
  const customer = await customerService.createCustomer(req.body);
  const tokens = await tokenService.generateAuthTokens(customer);
  res.status(httpStatus.CREATED).send({ customer, tokens });
});


module.exports = {
    sendOTP,
    verifyOTP,
    register
 
};
