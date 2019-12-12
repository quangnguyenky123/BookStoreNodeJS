'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var LoaiTaiKhoan = require('../../models/LoaiTaiKhoan');
var QuanTriVien = require('../../models/QuanTriVien');
/* GET users listing. */
router.get('/', function (req, res) {
	res.render('ThongTinCaNhan/ThongTinCaNhan.html');
});
router.post('/LoadData', async (req, res) => {
	var quanTriVien = await QuanTriVien.find({ _id: req.session.UserId });
	if (quanTriVien[0].IdLoaiTaiKhoan == '5de3427c1c9d440000dd4ebf') {
		var Account = quanTriVien;
		res.json({ data: quanTriVien, account: Account });
	}
	else {
		var AccountType = await LoaiTaiKhoan.find({ _id: quanTriVien[0].IdLoaiTaiKhoan });
		res.json({ data: quanTriVien, accountType: AccountType});
	}
});

//router.post('/LoadDetail', async (req, res) => {
//	var ID = mongoose.Types.ObjectId(req.body.id);
//	var quanTriVien;
//	quanTriVien = await QuanTriVien.aggregate([
//		{ $match: { _id: ID } },
//		{
//			$lookup:
//			{
//				from: "trangthaisudungs",
//				localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
//				foreignField: "_id",
//				as: "TenTrangThai"
//			}
//		},
//		{
//			$lookup:
//			{
//				from: "quyens",
//				localField: "IdQuyen",//Ban dau ko co truong IdTrangThai trong db => error
//				foreignField: "_id",
//				as: "TenQuyen"
//			}
//		}
//	]);//lay du lieu ung voi so trang
//	res.json({ status: "true", data: quanTriVien });
//});
router.post('/Update', async (req, res) => {
	var quanTriVien = await QuanTriVien.find({ _id: req.body.modelUpdate[0]._id });
	if (quanTriVien != null) {
		try {
			const updateItem = await QuanTriVien.updateOne(
				{ _id: req.body.modelUpdate[0]._id },
				{
					$set: {
						TenQuanTriVien: req.body.modelUpdate[0].TenQuanTriVien,
						DiaChi: req.body.modelUpdate[0].DiaChi,
						SoDienThoai: req.body.modelUpdate[0].SoDienThoai,
						ModifiedBy: req.session.UserId,
						ModifiedDate: Date.now()
					}
				}
			);
			res.json({ status: true });
		} catch (err) {
			res.json({ status: "error" });
		}
	}
	else
		res.json({ status: false });
});
router.post('/UpdatePassword', async (req, res) => {
	var quanTriVien = await QuanTriVien.find({ TaiKhoan: req.body.modelPassword[0].UserName, MatKhau: req.body.modelPassword[0].OldPassword });
	if (quanTriVien.length > 0) {
		try {
			const updateItem = await QuanTriVien.updateOne(
				{ _id: quanTriVien[0]._id },
				{
					$set: {
						MatKhau: req.body.modelPassword[0].NewPassword,
						ModifiedBy: req.session.UserId,
						ModifiedDate: Date.now()
					}
				}
			);
			res.json({ status: true });
		} catch (err) {
			res.json({ status: "error" });
		}
	}
	else
		res.json({ status: false });
});
//router.post('/Create', async (req, res) => {
//	var TaiKhoan = req.body.modelCreate[0].TaiKhoan;
//	var MatKhau = req.body.modelCreate[0].MatKhau;
//	var TenQuanTriVien = req.body.modelCreate[0].TenQuanTriVien;
//	var Email = req.body.modelCreate[0].Email;
//	var DiaChi = req.body.modelCreate[0].DiaChi;
//	var SoDienThoai = req.body.modelCreate[0].SoDienThoai;
//	var IdQuyen = req.body.modelCreate[0].IdQuyen;
//	var IdTrangThai = req.body.modelCreate[0].IdTrangThai;
//	var quanTriVien = new QuanTriVien({
//		TaiKhoan: TaiKhoan,
//		MatKhau: MatKhau,
//		TenQuanTriVien: TenQuanTriVien,
//		Email: Email,
//		DiaChi: DiaChi,
//		SoDienThoai: SoDienThoai,
//		IdQuyen: IdQuyen,
//		IdTrangThai: IdTrangThai,
//		IsDeleted: false,
//		ModifiedBy: "quangnguyenky123",
//		ModifiedDate: Date.now(),
//		CreatedBy: "quangnguyenky123",
//		CreatedDate: Date.now()
//	});
//	var quanTriVienCompare = (await QuanTriVien.find({ TaiKhoan: TaiKhoan })).length;
//	if (quanTriVienCompare == 0) {
//		try {
//			const saveQuanTriVien = await quanTriVien.save();
//			res.json({ status: "true" });
//		} catch{
//			res.json({ status: "error" });
//		}
//	}
//	else {
//		res.json({ status: "false" });
//	}

//});
//function escapeRegex(text) {
//	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
//};
module.exports = router;
