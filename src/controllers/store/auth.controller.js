const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { Vonage } = require('@vonage/server-sdk');
const otpGenerator = require('otp-generator');
const { User, OTP, Customer } = require('../../models');
const { customerService } = require('../../services/store');
const { tokenService, authService } = require('../../services');
const mailSender = require('../../utils/mailSender');

async function sendSMS(phone, otp) {
  // console.log(phone)
  if (phone) {
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
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
        throw err;
      });
  }
}
async function sendVerificationEmail(email, otp) {
  // console.log(email)
  if (email) {
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

const sendOTP = async (email, phone) => {
  try {
    // Check if user with email/phone already exists
    // Uncomment and adapt this part if needed
    let checkOtp;

    if (email) checkOtp = await OTP.findOne({ email }).exec();
    if (phone) checkOtp = await OTP.findOne({ phone }).exec();

    if (!checkOtp) {
      let otpPayload;
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      let result = await OTP.findOne({ otp });
      // console.log(result)
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        });
        result = await OTP.findOne({ otp }).exec();
      }
      if (email) {
        otpPayload = { email, otp };
        await OTP.create(otpPayload);
        await sendVerificationEmail(email, otp);
      }
      if (phone) {
        otpPayload = { phone, otp };
        await OTP.create(otpPayload);
        await sendSMS(phone, otp);
      }
      console.log('here')
      return {"status": true, "message": "Otp sent successfully" };
    }  else return {
      "status": false,
      "message": "OTP requested too early",
      };

   

   
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    throw error;
  }
};

const verifyOTP = async (otp, phone, email) => {
  let response;

  try {
    if (email) {
      response = await OTP.findOne({ email: email }).exec();
    } else if (phone) {
      response = await OTP.findOne({ phone: phone }).exec();
    }

    // console.log(otp)
    // console.log(response.otp)

    if (otp == response?.otp) {
      // console.log('true');
      return true; // OTP verified
    } else {
      // console.log('false');
      return false; // OTP verification failed
    }
  } catch (err) {
    throw err;
  }
};

const check_user_exists = async (email, phone) => {
  let response;
  if (email) {
    response = await Customer.findOne({ email }).exec();
    type = 'email';
  }
  if (phone) {
    response = await Customer.findOne({ phone }).exec();
    type = 'phone';
  }
  console.log(response);
  if (response) {
    return true;
  } else {
    return false;
  }
};

const register = catchAsync(async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    // check user exist

    // user shud never exist in case of registration, so check that first.
    // console.log(await check_user_exists(email, phone))
    if (! await check_user_exists(email, phone)) {
      console.log('user does not exist');
      if (!otp) {
        result =  await sendOTP(email, phone);
        // console.log(result)
        return res.status(202).json(result);
      }  else {
        // means we are on 2nd level of registration, with otp
        console.log('verify')
        if(await verifyOTP(otp,phone,email)) { // match otp with db
          const customer = await customerService.createCustomer({email,phone});
          console.log(customer);
         
          // response = await OTP.delete({ otp }).exec();
            if(customer) {
              const tokens = await tokenService.generateAuthTokens(customer);
              await OTP.deleteOne({otp}).exec();
                return res.status(201).json({
                    tokens,
                    status: true,
                    message: "Registration successful"
                });
            }

        } else {
          return res.json({"success": false, "message": "Invalid OTP"})
        }

    }
    } else {
      return res.json({"success": false, "message": "User exist"})
      // console.log('user exist');
    }

    // check pre check otp. if new then send otp. else check if less than 60 seconds

    // match otp then add user, send token.
  } catch (err) {
    throw err;
  }
});

const login = catchAsync(async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    
    if (await check_user_exists(email, phone)) {
     
      if (!otp) {
        result =  await sendOTP(email, phone);
        // console.log(result)
        return res.status(202).json(result);
      }  else {
        // means we are on 2nd level of registration, with otp
       
        if(await verifyOTP(otp,phone,email)) { // match otp with db
          const customer = await customerService.getUserByEmailOrPhone({email,phone});
          
        //  console.log(customer)
          // response = await OTP.delete({ otp }).exec();
            if(customer) {
              const tokens = await tokenService.generateAuthTokens(customer);
              await OTP.deleteOne({otp}).exec();
                return res.status(201).json({
                    customers,
                    tokens,
                    status: true,
                    message: "Login successful"
                });
            }

        } else {
          return res.json({"success": false, "message": "Invalid OTP"})
        }

    }
    } else {
      return res.json({"success": false, "message": "User does not exist"})
      // console.log('user exist');
    }

    // check pre check otp. if new then send otp. else check if less than 60 seconds

    // match otp then add user, send token.
  } catch (err) {
    throw err;
  }

  })


module.exports = {
  sendOTP,
  verifyOTP,
  register,
  login,
};
