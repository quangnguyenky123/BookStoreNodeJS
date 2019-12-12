'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var QuanTriVien = require('../../models/QuanTriVien');
var Quyen = require('../../models/Quyen');
/* GET users listing. */
router.get('/', function (req, res) {
	res.render('DangKy/DangKy.html');
});
router.post('/DangKy', async (req, res) => {
	var TaiKhoan = req.body.TaiKhoan;
	var MatKhau = req.body.MatKhau;
	var TenQuanTriVien = req.body.TenQuanTriVien;
	var Email = req.body.Email;
	var DiaChi = req.body.DiaChi;
	var SoDienThoai = req.body.SoDienThoai;
	var Type = req.body.Type;
	var IdLoaiTaiKhoan;
	if (Type == 0)
		IdLoaiTaiKhoan = mongoose.Types.ObjectId('5de3427c1c9d440000dd4ebf');
	if (Type == 1)
		IdLoaiTaiKhoan = mongoose.Types.ObjectId('5de343a41c9d440000dd4ec1');
	if (Type == 2)
		IdLoaiTaiKhoan = mongoose.Types.ObjectId('5de343d11c9d440000dd4ec2');
	var quanTriVien = new QuanTriVien({
		TaiKhoan: TaiKhoan,
		MatKhau: MatKhau,
		TenQuanTriVien: TenQuanTriVien,
		Email: Email,
		DiaChi: DiaChi,
		SoDienThoai: SoDienThoai,
		IdQuyen: mongoose.Types.ObjectId('5de377821c9d440000dd4ec3'),
		IdLoaiTaiKhoan: IdLoaiTaiKhoan,
		IdTrangThai: mongoose.Types.ObjectId('5dd6c4d03d9bfe5770f9911e'),
		IsDeleted: false,
		ModifiedBy: null,
		ModifiedDate: Date.now(),
		CreatedBy: null,
		CreatedDate: Date.now()
	});
	try {
		const saveQuanTriVien = await quanTriVien.save();
		res.json({ status: "true" });
	} catch{
		res.json({ status: "false" });
	}
});
router.post('/CheckUserName', async (req, res) => {
	var reqUserName = req.body.userName;
	var Type = req.body.type;
	var compareIdLoaiTaiKhoan;
	if (Type == 0)
		compareIdLoaiTaiKhoan = mongoose.Types.ObjectId('5de3427c1c9d440000dd4ebf');
	if (Type == 1)
		compareIdLoaiTaiKhoan = mongoose.Types.ObjectId('5de343a41c9d440000dd4ec1');
	if (Type == 2)
		compareIdLoaiTaiKhoan = mongoose.Types.ObjectId('5de343d11c9d440000dd4ec2');
	try {
		const quanTriVien = await QuanTriVien.find({ TaiKhoan: reqUserName, IdLoaiTaiKhoan: compareIdLoaiTaiKhoan, IdTrangThai: '5dd6c4d03d9bfe5770f9911e' });
		if (quanTriVien.length > 0) {
			res.json({ status: false });
		}
		else
			res.json({ status: true });
	} catch (err) {
		res.json({ status: "error" });
	}
});
function Clean(text) {
	return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};
module.exports = router;
