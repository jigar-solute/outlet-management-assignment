const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  validationResult
} = require('express-validator');

const User = require('../models/user.js');
const AreaManager = require('../models/areaManager.js')


const accessTokenSecret = 'somesupersecretsecret';
const refreshTokenSecret = 'somesupersecretsecret';
const refreshTokens = [];


exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const userRole = req.body.userRole;

  try {
    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      const error = new Error('User with this email already exists!');
      throw error;
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPwd,
      userRole: userRole
    });

    const existingAdmin = await User.findOne({
      userRole: 'admin'
    })

    if (existingAdmin && user.userRole === 'admin') {
      const error = new Error('Admin exists already!')
      throw error;
    }

    await user.save();

    res.status(201).json({
      message: 'User Created Successfully..!!'
    });
  } catch (err) {
    console.log(err)
  }
}

exports.areaManagerSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const password = req.body.password;
  const userRole = req.body.userRole;
  const city = req.body.city;
  try {
    const existingAreaManager = await AreaManager.findOne({
      email: email
    });

    if (existingAreaManager) {
      const error = new Error('Area Manager with this email already exists!');
      throw error;
    }


    const hashedPwd = await bcrypt.hash(password, 12);

    const areaManager = new AreaManager({
      email: email,
      password: hashedPwd,
      userRole: userRole,
      city: city
    });

    await areaManager.save();

    res.status(201).json({
      message: 'User Created Successfully..!!'
    });

  } catch (err) {
    console.log(err)
  }
}


exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      email: email
    })

    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = jwt.sign({ 
      email: user.email,
        userId: user._id.toString(),
        userRole: user.userRole
     }, accessTokenSecret, {
      expiresIn: '15s',
    });
    const refreshToken = jwt.sign({ email: user.email }, refreshTokenSecret, {
      expiresIn: '1d',
    });
    
       user.refreshTokens.push(refreshToken);
    await user.save();
   

    res.status(200).json({
      accesstoken: accessToken,
      refreshToken: refreshToken,
      message: 'User Found',
      userId: user._id.toString(),
      userRole: user.userRole
    });

  } catch (err) {
    console.log(err)
  }
}



exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found' });
  }


  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const accessToken = jwt.sign({ 
      email: user.email,
      userId: user._id.toString(),
      userRole: user.userRole
     }, accessTokenSecret, {
      expiresIn: '30s',
    });

    res.status(200).json({
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.areaManagerLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const areaManager = await AreaManager.findOne({
      email: email
    })

    if (!areaManager) {
      const error = new Error('A area Manager with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, areaManager.password);

    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({
        email: areaManager.email,
        userId: areaManager._id.toString(),
        userRole: areaManager.userRole
      },
      process.env.JWT_SECRET_KEY, {
        expiresIn: '1h'
      }
    );

    res.status(200).json({
      token: token,
      message: 'Area manager Found',
      userId: areaManager._id.toString(),
      userRole: areaManager.userRole
    });

  } catch (err) {
    console.log(err)
  }
}


exports.logout = async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  
  try {
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    // Remove the provided refresh token from the user's refreshTokens array
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    await user.save();

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    console.log(err);
    next(err);
  }
};