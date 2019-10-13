module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/posts')
  })
  // 当一个路径有多个匹配规则时，使用app.use（）
  app.use('/signup', require('./signup'))
  app.use('/signin', require('./signin'))
  app.use('/signout', require('./signout'))
  app.use('/posts', require('./posts'))
  app.use('/comments', require('./comments'))
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).render('404')
    }
  })
}
