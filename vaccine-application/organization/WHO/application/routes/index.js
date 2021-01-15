const express = require('express');

const router = express.Router();
const verifyLotRoutes = require('../features/verify-lot/routes');
const mountRegisterRoutes = require('../features/register/routes');
const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');
const mountResetPasswordRoutes = require('../features/reset-password/routes');
const mountProfileRoutes = require('../features/profile/routes');
const listVaccineRoutes = require('../features/list-vaccine/routes');
function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

/* GET home page. */
router.get('/', isAuthenticated, (req, res) => {
  return res.redirect('/list-vaccine');
});




mountRegisterRoutes(router);
mountLoginRoutes(router);
mountLogoutRoutes(router, [isAuthenticated]);
mountResetPasswordRoutes(router);
mountProfileRoutes(router, [isAuthenticated]);
verifyLotRoutes(router, [isAuthenticated]);
listVaccineRoutes(router,[isAuthenticated])
module.exports = router;
