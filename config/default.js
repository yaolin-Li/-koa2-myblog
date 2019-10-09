module.exports = {
  port: 3000,
  session: {
    secret: 'mylog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mongodb: 'mongodb+srv://liyaolin:mongodb970518@demo-nfc7w.mongodb.net/test?retryWrites=true&w=majority'
}
