const User = require('../models/user')
const userController = {}
//
userController.login= (req, res) =>{
  res.render('login/index')
}

userController.auth= async(req, res) =>{
  try {
    const user = await User.authenticate(req.body.username, req.body.password)
    req.session.regenerate(() => {
      req.session.userName = user.username
      req.session.flash = { type: 'success', text: 'Successfully logged in.' }
      res.redirect('..')
    })
    
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}
userController.logout= (req, res)=>{
  try {
    req.session.destroy()
    res.redirect('../')
    
  } catch (error) {
    req.session.flash = {
      type: 'fail',
      text: 'Failed to logout!'
    }
    res.redirect('../')
  }
}
userController.register= (req, res)=>{
  res.render('register/index')
}
userController.create= async(req, res, next)=>{
  if (
    req.body.username.length > 2 &&
    req.body.password.length > 4 &&
    req.body.password === req.body.password2
  ){
    try {
      console.log(req.body.username,"("+req.body.password+")")
      console.log("("+req.body.password2+")")
      const user = new User({
        username: req.body.username,
        password: req.body.password
      })
      console.log(this.user)
      
      await user.save()
      console.log('dj kaliddiriye')
      req.session.flash = {
        type: 'success',
        text: 'Successfully created, please login.'
      }
      res.redirect('../login')
      
    } catch (error) {
      error.statusCode=500
      return next(error)
      
    }
  }
    else if (req.body.username.length < 2) {
      req.session.flash = {
        type: 'danger',
        text: 'UserName must be at least 3 characters.'
      }
      res.redirect('.')
    } else if (req.body.password !== req.body.password2) {
      req.session.flash = { type: 'danger', text: "Passwords don't match." }
      res.redirect('.')
    } else if (req.body.password.length < 5) {
      req.session.flash = {
        type: 'danger',
        text: 'Password must be at least 5 characters.'
      }
      res.redirect('.')
    } else {
      req.session.flash = {
        type: 'danger',
        text: 'Something went wrong, please try again.'
      }
      res.redirect('.')
    }
  
}
module.exports=userController