const express = require('express');
const router = express.Router();

//Test connection
/* router.use((req, res, next) => {
  console.log('AUTH ROUTES HIT:', req.method, req.originalUrl);
  next();
});
 */
const {
  register,
  login,
  me,
  logout,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.post('/logout', protect, logout);

module.exports = router;
