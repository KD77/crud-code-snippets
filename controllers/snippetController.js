const Snippet = require('../models/snippet')
const moment = require('moment')
const snippetController = {}

snippetController.index = async( req,res, next)=>{
  try {
    const data={
      snippets:(await Snippet.find({})).map((snippet)=>({
        id:snippet._id,
        user:snippet.username,
        snippet:snippet.snippet,
        createdAt: moment(snippet.createdAt).format('YY-MM-DD HH:mm'),
        updatedAt: moment(snippet.updatedAt).format('YY-MM-DD HH:mm')

      }))
    }
    data.snippets.reverse()
    res.render('snippets/index',{viewData: data})
    
  } catch (error) {
    error.statusCode=500
    return next(error)
    
  }

}
snippetController.new= async(req, res)=>{
  res.render('snippets/new',{})

}

snippetController.create= async(req, res, next)=>{
  if(req.body.snippet.trim().length){
    try {
       const snpt = new Snippet({
      username: req.session.userName,
      snippet: req.body.snippet
    })
  
    await snpt.save()
    req.session.flash={
      type: 'success',
      text: 'Snippet successfully saved.'
    }
    res.redirect('.')

    } catch (error) {
      error.statusCode=500
      return next(error)
      
    }
   
  }else {
    req.session.flash = {
      type: 'danger',
      text: 'Obs .. Snippet Code must be One character or more.'
    }
    res.redirect('.')
  }


}
snippetController.update= async( req, res, next)=>{
  if(req.body.snippet){
    try {
      const update = await Snippet.updateOne(
        { _id: req.params.id },
        {
          snippet: req.body.snippet
        }
      )
      if (result.nModified === 1) {
        req.session.flash = {
          type: 'success',
          text: 'The code snippet was updated successfully.'
        }
      } else {
        req.session.flash = {
          type: 'danger',
          text: 'Unable to update code snippet.'
        }
      }
      res.redirect('..')
      
    } catch (error) {
      error.statusCode=500
      return next(error)
    }
  }else {
    req.session.flash = {
      type: 'danger',
      text: 'Obs .. Snippet Code must be One character or more.'
    }
    res.redirect('./edit')
  }
}
snippetController.delete=async( req, res, next)=>{
  try {
    await Snippet.deleteOne({ _id: req.params.id })
    req.session.flash = {
      type: 'success',
      text: 'The code snippet was deleted successfully.'
    }
    res.redirect('..')
    
  } catch (error) {
    error.statusCode=500
    return next(error)
  }
}
snippetController.remove= async( req, res, next)=>{
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    const viewData = {
      id: snippet._id,
      snippet: snippet.snippet
    }
    res.render('snippets/remove', { viewData })
  } catch (error) {
    error.statusCode=500
    return next(error)
    
  }
}
snippetController.edit= async( req, res, next)=>{
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    const data = {
      id: snippet._id,
      user: snippet.username,
      snippet: snippet.snippet,
      createdAt: moment(snippet.createdAt).format('YY-MM-DD HH:mm'),
      updatedAt: moment(snippet.updatedAt).format('YY-MM-DD HH:mm')
    }
    res.render('snippets/edit', { viewData: data })
    
  } catch (error) {
    error.statusCode=500
    return next(error)
    
  }
}
snippetController.authorize= async( req, res, next)=>{
  if (!req.params.id && req.session.userName) {
    return next()
  }
  const userName=async()=>{
    const user = await Snippet.findOne({ _id: req.params.id })
    return user.username

  }
  if (!req.session.userName || req.session.userName !== (await userName())) {
    const err = new Error('403: Forbidden')
    err.statusCode = 403
    return next(err)
  }
  next()
}
module.exports=snippetController