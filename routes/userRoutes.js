const express = require('express');
const { registerUser, loginUser, getProfile, updateProfile, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middlewares/userMiddleware');

const router = express.Router();

// Đăng ký người dùng
router.post('/register', registerUser);

// Đăng nhập người dùng
router.post('/login', loginUser);

// Xem hồ sơ người dùng
router.get('/profile', authMiddleware, getProfile);

// Chỉnh sửa thông tin cá nhân
router.put('/profile', authMiddleware, updateProfile);

// Đổi mật khẩu
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
