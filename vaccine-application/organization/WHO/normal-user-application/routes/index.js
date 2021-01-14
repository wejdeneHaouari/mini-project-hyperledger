const express = require('express');

const router = express.Router();
const verifyLotRoutes = require('../features/verify-lot/routes');



/* GET home page. */
router.get('/', (req, res) => {
  return res.redirect('/verify-lot');
});





verifyLotRoutes(router);

module.exports = router;
