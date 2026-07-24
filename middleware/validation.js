// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Validate user input
const validateUserInput = (req, res, next) => {
  const { email, password, fullName } = req.body;
  
  if (email && !validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email không hợp lệ'
    });
  }
  
  if (password && !validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Mật khẩu phải có ít nhất 6 ký tự'
    });
  }
  
  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUserInput
};
