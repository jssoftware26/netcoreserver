import nodemailer from "nodemailer";
/*
console.log("SMTP HOST:", process.env.BREVO_SMTP_HOST);
console.log("SMTP PORT:", process.env.BREVO_SMTP_PORT);
console.log("SMTP USER:", process.env.BREVO_SMTP_USER);
*/

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,
    auth:{
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

transporter.verify((error, success)=>{
    if(error){
        console.log("SMTP ERROR:", error);
    }else{
        console.log("SMTP SERVER READY:", success);
    }
});

export const sendVerificationEmail = async(email, otp)=>{
    const mailOptions = {
        from: `"NetCore Software Service" <${process.env.BREVO_FROM_EMAIL}>`,
        to: email,
        subject: "Verify your email",

        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Email Verification</h2>
                <p>
                    Thank you for creating an account.
                </p>
                <p>
                    Your verification code is:
                </p>
                <h1>${otp}</h1>
                <p>
                    This code will expire in 5 minutes.
                </p>
                <p>
                    If you did not request this code,
                    you can ignore this email.
                </p>
            </div>
        `
    };
    const result = await transporter.sendMail(mailOptions);
    
    console.log("EMAIL SENT:", result.messageId);
    console.log("EMAIL ACCEPTED:", result.accepted);

    return result;
};