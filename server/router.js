const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getNFTs', mid.requiresLogin, controllers.NFT.getNFTs);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.delete('/delete-NFT', mid.requiresLogin, controllers.NFT.deleteNFT);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.NFT.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.NFT.make);
  //
  app.post('/passChange', mid.requiresLogin, controllers.Account.changePassword);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
