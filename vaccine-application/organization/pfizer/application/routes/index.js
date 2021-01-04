const express = require('express');

const router = express.Router();

const mountRegisterRoutes = require('../features/register/routes');
const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');
const mountResetPasswordRoutes = require('../features/reset-password/routes');
const mountProfileRoutes = require('../features/profile/routes');
const mountVaccineRoutes = require('../features/add-vaccine/routes');
const mountLotRoutes = require('../features/add-lot/routes');
const listVaccineRoutes = require('../features/list-vaccine/routes');
const listLotRoutes = require('../features/list-lot/routes');
const verifyLotRoutes = require('../features/verify-lot/routes');
function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

/* GET home page. */
router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/dashboard');
});

router.get('/icons', isAuthenticated, (req, res) => {
  res.render('pages/icons');
});

router.get('/maps', isAuthenticated, (req, res) => {
  res.render('pages/maps');
});

router.get('/tables', isAuthenticated, (req, res) => {
  res.render('pages/tables');
});

mountRegisterRoutes(router);
mountLoginRoutes(router);
mountLogoutRoutes(router, [isAuthenticated]);
mountResetPasswordRoutes(router);
mountProfileRoutes(router, [isAuthenticated]);
mountVaccineRoutes(router, [isAuthenticated]);
mountLotRoutes(router,[isAuthenticated])
listVaccineRoutes(router,[isAuthenticated])
listLotRoutes(router,[isAuthenticated])
verifyLotRoutes(router);
module.exports = router;
