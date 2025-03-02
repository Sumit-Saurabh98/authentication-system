import nodemailer from "nodemailer";

export const sendTwoFactorEmail = async (
    email: string,
    token: string
) =>{
    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const emailTemplate = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-Factor Authentication Code - Pair Connection</title>
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
            text-align: center;
        }
        .greeting {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .message {
            margin-bottom: 25px;
            font-size: 16px;
        }
        .code-container {
            margin: 30px auto;
            max-width: 320px;
            padding: 15px;
            background-color: #f5f7ff;
            border: 1px solid #e1e5ff;
            border-radius: 8px;
        }
        .code {
            font-family: 'Courier New', monospace;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 4px;
            color: #4A6FFF;
        }
        .expiry-note {
            margin-top: 25px;
            font-size: 14px;
            color: #777;
        }
        .security-note {
            margin-top: 25px;
            background-color: #fff8e6;
            border-left: 4px solid #ffc107;
            padding: 15px;
            text-align: left;
            border-radius: 4px;
            font-size: 14px;
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
            .code {
                font-size: 28px;
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
            <div class="greeting">Your Authentication Code</div>
            
            <div class="message">
                Use the code below to complete the two-factor authentication process for your Pair Connection account:
            </div>
            
            <div class="code-container">
                <div class="code">${token}</div>
            </div>
            
            <div class="expiry-note">
                This code will expire in 1 hours.
            </div>
            
            <div class="security-note">
                <strong>Security Notice:</strong> If you didn't request this code, please change your password immediately and contact our support team as your account may have been compromised.
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
        subject: "2FA Authentication Code",
        html: emailTemplate,
    });
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const resetLink = `${process.env.BASE_URL}/auth/new-password?token=${token}`;

    const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Pair Connection</title>
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
        .reset-button {
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
        .reset-button:hover {
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
        .warning {
            background-color: #fff8e6;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
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
            <div class="greeting">Reset Your Password</div>
            
            <div class="message">
                We received a request to reset your password for your Pair Connection account. To create a new password, click on the button below.
            </div>
            
            <div class="button-container">
                <a href="${resetLink}" class="reset-button">Reset Password</a>
            </div>
            
            <div class="warning">
                This password reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
            </div>
            
            <div class="message" style="margin-top: 20px;">
                For security reasons, please create a strong password that you don't use on other websites.
            </div>
        </div>
        
        <div class="footer">
            <div>© 2025 Pair Connection. All rights reserved.</div>
            <div style="margin-top: 10px;">123 Connection Street, San Francisco, CA 94105</div>
        </div>
    </div>
</body>
</html>`

    await transport.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Reset Your Password",
        html: emailTemplate,
      });
}




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
`;

  await transport.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "Confirm your email",
    html: emailTemplate,
  });
};
