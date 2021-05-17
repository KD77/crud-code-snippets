const homeController={}

homeController.index=(req, res)=>{
  res.render('home/index')
}
module.exports=homeController