function register({email, mobile, otp}) {
    // user shud never exist in case of registration, so check that first. 
    if(!check_user_exists({email, mobile})) {   // if false then we are good.  

        // we are on first level of registration
        if(!otp) {
            return send_otp({email, mobile});
        }
        else {
            // means we are on 2nd level of registration, with otp

            if(match_otp()) { // match otp with db

                if(add_user()) {
                    generate_token();
                    return {
                        status: true,
                        message: "Registratino successful"
                    };
                }

            } 

        }

    } else {

    return {
        "status": false,
        "message": "User already exists"
    }
}
}

function check_user_exits({email, mobile}) { // returns true or false
    if(email) {

    }

    if(mobile){

    }
}


function send_otp({email, mobile}) { // returns object with success or failure

    if(email) var checkOtp = otpModel.findOne(email);
    if(mobile) var checkOtp = otpModel.findOne(mobile);

    if(!checkOtp || checkOtp.datetime > "60s" ) {
        //send otp
        if(email) {
            otp = apiEmailCall();
        }
        if(mobile) {
            otp = apiMobileCall();
        }

        save_otp_in_db();
        return {"status": true, "message": "Otp sent successfully"};
    }
    else return {
                "status": false,
                "message": "OTP requested too early",
                };

}


function match_otp() { // returns true or throw error if false

}


function add_user() { // returns true or throw error if false

}

function login({email, mobile, otp}) {
    // incase of login, user must exist
    if(check_user_exists({email, mobile})) { // if true then move ahead
        if(!otp) {
            return send_otp({email, mobile});
        }
        else {

            if(match_otp({email, mobile, otp})) { // match otp with db

                    generate_token();
                    return {
                        status: true,
                        token: "xxxxx",
                        message: "Login successful"
                    };
                

            } 
        }
    }
    else {
        //throw error
    }
}