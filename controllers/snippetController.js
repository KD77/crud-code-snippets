const Snippet = require('../models/snippet')
const moment = require('moment')
const snippetController = {}

snippetController.index = async( req,res, index)=>{
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