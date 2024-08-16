const jwt = require("jsonwebtoken");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { jwtDecode } = require("jwt-decode");

const accessValidation = (req, res, next) => {
  const {authorization} = req.headers;
  
  if(!authorization) {
    return res.status(401).json({
      message: 'Invalid authorization'
    })
  }
  const token = authorization.split(' ')[1];
  const secret = process.env.JWT_SECRET_KEY;
  
  try {
    const jwtDecode =  jwt.verify(token, secret)
    
    req.userData = jwtDecode
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  
  next()
}

const getAll = async (req, res) => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      age: true,
    }
  });

  res.send(users);
};

const profile = async (req, res) => {
  let { authorization } = req.headers;

  const decoded = jwtDecode(authorization.split(" ")[1]);
  const me = await prisma.users.findUnique({
    where: {
      email: decoded.email,
    },
  });
  res.send(me);
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({
      message: "Invalid username/password supplied"
    });
  }

  const user = await prisma.users.findUnique({
    where: {
      email: email,
    },
  });


  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = password === user.password;
  if (isPasswordValid) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let payload = {
      time: Date(),
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
    };

    expireIn = 60 * 60 * 1;

    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: expireIn });

    return res.status(200).json({
      message: 'Success',
      data: payload,
      token: token
    });
  } else {
    return res.status(403).json({
      message: "Wrong Password"
    })
  }
};

const register = async (req, res) => {
  const { username, email, firstName, lastName, password } = req.body

  const checkEmail = await prisma.users.findUnique({
    where: {
      email: email
    }
  });

  const checkUsername = await prisma.users.findUnique({
    where: {
      username: username
    }
  })

  if(checkEmail){
    res.status(403).json({
      message: "Email already registered"
    })
  } else if(checkUsername) {
    res.status(403).json({
      message: "Username already registered"
    })
  } else {
    const user = await prisma.users.create({
      data: {
        username: username,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password
      }
    })
  
    if(!user) {
      res.status(403).json({
        message: "Error"
      })
    } else {
      res.status(201).json({
        message: "Registration successful",
        data: user
      })
    }
  }
};

const deleteUser = async (req, res) => {
  const { username } = req.body;
}

const validateToken = (req, res, next) => {
  let { authorization } = req.headers;
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const token = authorization.split(" ")[1];

    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return res.send("Successfully Verified");
    } else {
      // Access Denied
      return res.status(401).send(error);
    }
  } catch (error) {
    // Access Denied
    return res.status(401).send(error);
  }
};

module.exports = { accessValidation, getAll, profile, login, validateToken, register };
