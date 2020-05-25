module.exports = {
  configureWebpack: {
    resolve: {
      alias: {

      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production' ?
    '/web/' :
    '/'
}