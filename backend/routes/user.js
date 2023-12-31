const sendEmail = require('../utils/email');
const Token = require('../models/token');
const User=require('../models/user');
const crypto = import('crypto');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const verify = require('../middleware/verifyToken');
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { logout,getUserDetails,getAllUser,getSingleUser,deleteUser ,updateTodo,deleteTodo,createKyc,getAllKyc,verifyKyc} = require('../controllers/userController');

// const { session } = require('passport');


//register user
router.post('/register', async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    if (userData && userData.verified == true)
      return res.status(400).json({msg:'User with given email already exist!'});

    if (userData && userData.verified== false)
      return res
        .status(400)
        .json({msg:'verification email has been already sent to your email'});

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

   const user = await new User({
      username:req.body.username,
      email: req.body.email,
      password: hashPassword,
      role:req.body.role,
    }).save();
    
    let token = await new Token({
      userId: user._id,
      token: (await crypto).randomBytes(32).toString('hex'),
      expireIn:new Date().getTime()+ 300*1000
    }).save();
    
    await sendEmail(req.body.email, `<a href='${process.env.BASE_URL}/user/verify/${user.id}/${token.token}'>verify here</a>`);
    res.status(200).json({msg:'An Email sent to your account please verify'});

  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});



//verify user email
router.get('/verify/:id/:token', async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });


    if (!user ) return res.status(400).json({msg:'Invalid link'});


    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).json({msg:'Invalid link'});
    if (token){
      const currentTime= new Date().getTime()
      const diff=token.expireIn-currentTime
      if(diff<0){
        res.status(400).json({msg:'link expired register again'})
        await User.findByIdAndRemove(user._id);

      }
    }

    await user.updateOne({ _id:user._id, verified:true });
    await Token.findByIdAndRemove(token._id);
    link='http://localhost:5173/loginuser'
     res.status(200).json({msg:`email verified sucessfully proceed to login`});

    
  } catch (error) {
  
    res.status(400).json({msg:'An error occured'});
  }
});

//login the user
router.post('/login', async (req, res) => {
    //checking email exists
    const user = await User.findOne({ email: req.body.email });
    

    if (!user) return res.status(400).json({msg:' doesnot exist please sign in'});
  //if user logins
    
      //check verified user or not
    if ((user && user.verified == false ))
      return res.status(400).json({msg:'verify before login!'});
  
    //password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).json({msg:'invalid email or password'});
   
    
    // sending token
    const token=jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
  //options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(201).cookie("token",token, options).json({
    success: true,
    user,
    token,
  });



  });

// //add into and delete todo list
// router.route("/add/todo").put( isAuthenticatedUser,updateTodo);
// router.route("/delete/todo").delete( isAuthenticatedUser,deleteTodo);
 
//logout user

router.route("/logout").get(logout);

router.route("/me").get( isAuthenticatedUser,getUserDetails);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

  //create kyc
  router
  .route("/submit/kyc")
  .post(isAuthenticatedUser,createKyc);

  //get all kyc
  router
  .route("/allkyc")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllKyc);
  //verify kyc
  router
  .route("/verify/kyc")
  .post(isAuthenticatedUser, authorizeRoles("admin"), verifyKyc);

 

module.exports = router;
