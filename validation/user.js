const Joi = require('joi');

const registerSchema = Joi.object({
    userName: Joi.string().required().messages({
        'string.empty': 'Tên người dùng là bắt buộc',
        'any.required': 'Tên người dùng là bắt buộc'
    }),
    phoneNumber: Joi.string().pattern(/^\d{10,11}$/).required().messages({
        'string.empty': 'Số điện thoại là bắt buộc',
        'string.pattern.base': 'Số điện thoại phải có từ 10 đến 11 chữ số',
        'any.required': 'Số điện thoại là bắt buộc'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'string.empty': 'Mật khẩu là bắt buộc', 
        'any.required': 'Mật khẩu là bắt buộc'
    }),
    diaChi: Joi.string().required().messages({
        'string.empty': 'Địa chỉ là bắt buộc',
        'any.required': 'Địa chỉ là bắt buộc'
    }),
    email: Joi.string().email().optional(),
    role: Joi.string().optional() 
});

// Schema for user login
const loginSchema = Joi.object({
    phoneNumber: Joi.string().pattern(/^\d{10,11}$/).required().messages({
        'string.empty': 'Số điện thoại là bắt buộc',
        'string.pattern.base': 'Số điện thoại phải có từ 10 đến 11 chữ số',
        'any.required': 'Số điện thoại là bắt buộc'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
        'string.empty': 'Mật khẩu là bắt buộc',
        'any.required': 'Mật khẩu là bắt buộc'
    })
});


const updateProfileSchema = Joi.object({
    userName: Joi.string().min(3).max(30),
    diaChi: Joi.string().max(100),
    email: Joi.string().email().max(50)
});

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required()
});

module.exports = { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema };


