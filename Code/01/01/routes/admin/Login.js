'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var QuanTriVien = require('../../models/QuanTriVien');
var Quyen = require('../../models/Quyen');
/* GET users listing. */
router.get('/',function (req, res) {
	res.render('Login/Login.html');
});
router.post('/CheckLogin', async (req, res) => {
	var reqUserName = req.body.userName;
	var reqPassword = req.body.password;
	var type = req.body.type;
	var IdLoaiTaiKhoan;
	if (type == 0) {
		IdLoaiTaiKhoan = mongoose.Types.ObjectId('5de3427c1c9d440000dd4ebf');
	}
	if (type == 1) {
		IdLoaiTaiKhoan = mongoose.Types.ObjectId('5de343a41c9d440000dd4ec1');
	}
	if (type == 2) {
		IdLoaiTaiKhoan = mongoose.Types.ObjectId('5de343d11c9d440000dd4ec2');
	}
	try {
		const quanTriVien = await QuanTriVien.find({ TaiKhoan: reqUserName, MatKhau: reqPassword, IdLoaiTaiKhoan: IdLoaiTaiKhoan, IdTrangThai: '5dd6c4d03d9bfe5770f9911e' });
		if (quanTriVien.length > 0) {
			var quyen = await Quyen.find({ _id: quanTriVien[0].IdQuyen });
			req.session.UserId = quanTriVien[0]._id;
			req.session.Quyen = quyen[0].TenQuyen;
			res.json({ status: "true", redirect: '/' });
		}
		else
			res.json({ status: "false" });
	} catch (err) {
		res.json({ status: "error" });
	}
});
router.post('/LogOut', async (req, res) => {
	try {
		req.session.destroy();
		res.json({ status: true });
	}
	catch{
		res.json({ status: false });
	}
	
});
function Clean(text) {
	return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};


module.exports = router;
