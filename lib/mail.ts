import nodemailer from "nodemailer";



export const sendVerificationEmail = async (email: string, token: string) => {
    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const confirmLink = `${process.env.BASE_URL}/auth/new-verification?token=${token}`;

    const emailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Pair Connection</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #4A6FFF;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-decoration: none;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
        }
        .greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .message {
            margin-bottom: 30px;
            font-size: 16px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .verify-button {
            display: inline-block;
            background-color: #4A6FFF;
            color: white;
            text-decoration: none;
            padding: 14px 30px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 16px;
            transition: background-color 0.3s;
        }
        .verify-button:hover {
            background-color: #3A5FEF;
        }
        .alternative {
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
        .link {
            color: #4A6FFF;
            word-break: break-all;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #777;
        }
        .social-links {
            margin-top: 15px;
        }
        .social-icon {
            display: inline-block;
            margin: 0 8px;
            color: #4A6FFF;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">PAIR CONNECTION</div>
        </div>
        
        <div class="content">
            <div class="greeting">Verify Your Email Address</div>
            
            <div class="message">
                Thank you for signing up with Pair Connection! To complete your registration and access all our features, please verify your email address by clicking the button below.
            </div>
            
            <div class="button-container">
                <a href="${confirmLink}" class="verify-button">Verify My Email</a>
            </div>
            
            <div class="message">
                This verification link will expire in 24 hours. If you didn't create an account with Pair Connection, please ignore this email.
            </div>
        </div>
        
        <div class="footer">
            <div>© 2025 Pair Connection. All rights reserved.</div>
            <div style="margin-top: 10px;">123 Connection Street, San Francisco, CA 94105</div>
        </div>
    </div>
</body>
</html>
`

    await transport.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Confirm your email",
        html: emailTemplate,
    });
};


