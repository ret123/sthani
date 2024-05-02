const httpStatus = require('http-status');
const catchAsync = require('../../utils/catchAsync');
const { Vonage } = require('@vonage/server-sdk');
const otpGenerator = require('otp-generator');
const { User, OTP, Customer, Token } = require('../../models');
const { customerService } = require('../../services/store');
const { tokenService, authService } = require('../../services');
const mailSender = require('../../utils/mailSender');
const config = require('../../config/config');
const jwt = require('jsonwebtoken');

async function sendSMS(mobile, otp) {
  try {
    // console.log(mobile)
    if (mobile) {
      // const vonage = new Vonage({
      //   apiKey: process.env.VONAGE_API_KEY,
      //   apiSecret: process.env.VONAGE_API_SECRET,
      // });
      // const from = 'Vonage APIs';
      // const to = mobile;
      // const text = `Verifcation Code: ${otp}. Valid for 1 minute `;

      // const res = await vonage.sms.send({ to, from, text });
      const res =true
      if (res) {
        console.log('Message sent successfully');
        return true;
      }
    }
    return false;
  } catch (err) {
    console.log('There was an error sending the messages.');
    console.error(err);
    throw err;
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
      return true;
    } catch (error) {
      console.log('Error occurred while sending email: ', error);
      throw error;
    }
  }
}

const sendOTP = async (email, mobile) => {
  try {
    // Check if user with email/mobile already exists
    // Uncomment and adapt this part if needed
    let checkOtp;
    console.log(mobile);

    if (email) checkOtp = await OTP.findOne({ email }).exec();
    if (mobile) checkOtp = await OTP.findOne({ mobile }).exec();

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

        if (await sendVerificationEmail(email, otp)) {
          await OTP.create(otpPayload);
        }
      }
      // if (mobile) {
      //   otpPayload = { mobile, otp };
      //   console.log(otpPayload);

      //   const res = await sendSMS(mobile, otp);
      //   console.log('res' + res);

      //    if(res) {
      //     await OTP.create(otpPayload);
      //    }
      // }
      if (mobile) {
        otpPayload = { mobile, otp };
        console.log('otpPayload:', otpPayload);
      
        const res = await sendSMS(mobile, otp);
        console.log('sendSMS result:', res);
      
        if (res) {
          await OTP.create(otpPayload);
          console.log('OTP record created successfully');
        } else {
          console.log('mobile number is null. Skipping SMS and OTP creation.');
        }
      }

      return { status: 202, message: 'Otp sent successfully' };
    } else
      return {
        status: 429,
        message: 'Too Many Requests: Please wait at least 60 seconds before requesting another OTP',
      };
  } catch (error) {
    throw {
      status: 504,
      message: 'Gateway timeout: Could not send OTP, please try again',
    };
  }
};

const verifyOTP = async (otp, mobile, email) => {
  let response;

  try {
    if (email) {
      response = await OTP.findOne({ email: email }).exec();
    }
    if (mobile) {
      response = await OTP.findOne({ mobile: mobile }).exec();
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

const check_user_exists = async (email, mobile) => {
  try {
    let response;
  if (email) {
    response = await Customer.findOne({ email }).exec();
    type = 'email';
  }
  if (mobile) {
    response = await Customer.findOne({ mobile }).exec();
    type = 'mobile';
  }
  // console.log(response);
  if (response) {
    return true;
  } else {
    return false;
  }
  } catch(err) {
    throw err
  }
  
};

const register = catchAsync(async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;

    // check user exist

    // user shud never exist in case of registration, so check that first.
    // console.log(await check_user_exists(email, mobile))
    const user = await check_user_exists(email, mobile);
    if (!user) {
      // console.log('user does not exist');
      if (!otp) {
        result = await sendOTP(email, mobile);
        // console.log(result)
        if (result.status === 202) {
          res.status(202).json({ status: result.status, message: result.message });
        }
        if (result.status === 429) {
          res.status(429).json({ status: result.status, message: result.message });
        }
      } else {
        // means we are on 2nd level of registration, with otp

        if (await verifyOTP(otp, mobile, email)) {
          // match otp with db
          const customer = await customerService.createCustomer({ email, mobile });
          console.log(customer);
          // response = await OTP.delete({ otp }).exec();
          if (customer) {
            const tokens = await tokenService.generateAuthTokens(customer);
            await OTP.deleteOne({ otp }).exec();
            res.cookie('refreshToken', tokens.refresh.token, {
              httpOnly: true,
              // secure: true,
              // sameSite: 'None',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(201).json({
              tokens,
              status: 201,
              message: 'Registration successful',
            });
          }
        } else {
          res.status(400).json({ status: 400, message: 'Invalid OTP' });
        }
      }
    } else {
      res.status(409).json({ status: 409, message: 'User already exist' });
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
    const { email, mobile, otp } = req.body;

    if (await check_user_exists(email, mobile)) {
      if (!otp) {
        result = await sendOTP(email, mobile);

        if (result.status === 202) {
          res.status(202).json({ status: result.status, message: result.message });
        }
        if (result.status === 429) {
          res.status(429).json({ status: result.status, message: result.message });
        }
      } else {
        // means we are on 2nd level of registration, with otp

        if (await verifyOTP(otp, mobile, email)) {
          // match otp with db
          const customer = await customerService.getUserByEmailOrPhone({ email, mobile });

          //  console.log(customer)
          // response = await OTP.delete({ otp }).exec();
          if (customer) {
            const tokens = await tokenService.generateAuthTokens(customer);
            await OTP.deleteOne({ otp }).exec();
            res.cookie('refreshToken', tokens.refresh.token, {
              httpOnly: true,
              // secure: true,
              // sameSite: 'None',
              maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({
              tokens,
              status: 200,
              message: 'Login successful',
            });
          }
        } else {
          res.status(400).json({ status: 400, message: 'Invalid OTP' });
        }
      }
    } else {
      res.status(404).json({ status: 404, message: 'User does not exist' });
      // console.log('user exist');
    }

    // check pre check otp. if new then send otp. else check if less than 60 seconds

    // match otp then add user, send token.
  } catch (err) {
    throw err;
  }
});

const refreshToken = catchAsync(async (req, res) => {

  try {
    const cookies = req.cookies;

    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Unauthorized' });
    const refreshToken = cookies.refreshToken;
    jwt.verify(
      refreshToken,
      config.jwt.secret,
      catchAsync(async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
  
        const storedRefreshToken = await Token.findOne({ token: refreshToken });
  
        if (!storedRefreshToken || storedRefreshToken.expires < new Date()) {
          return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }
        const customer = await Customer.findById(storedRefreshToken.user);
        if (!customer) return res.status(401).json({ message: 'Unauthorized' });
  
        const tokens = await tokenService.generateAuthTokens(customer);
  
        res.cookie('refreshToken', tokens.refresh.token, {
          httpOnly: true,
          // secure: true,
          // sameSite: 'None',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(201).json({ tokens });
      })
    );

  } catch(err) {
    throw err
  }
 
});

module.exports = {
  sendOTP,
  verifyOTP,
  register,
  login,
  refreshToken,
};
