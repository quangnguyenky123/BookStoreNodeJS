'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var Quyen = require('../../models/Quyen');
var QuanTriVien = require('../../models/QuanTriVien');
/* GET users listing. */
router.get('/', function (req, res) {
	res.render('QuanLyQuanTriVien/QuanLyQuanTriVien.html');
});
router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;//Tên Danh Mu?c c?n tìm
	var page = req.body.page;//S? trang ?ang ch?n
	var pageSize = req.body.pageSize;//S? dòng d? li?u hi?n th? trên 1 trang
	var totalRow;//Tong so dong de phan trang
	var quanTriVien;
	var trangThaiSuDung = await TrangThaiSuDung.find({});
	var quyen = await Quyen.find({});
	if (searchString != "") {
		const regex = new RegExp(escapeRegex(searchString), 'gi');
		totalRow = (await QuanTriVien.find({ TaiKhoan: regex, _id: { '$ne': mongoose.Types.ObjectId(req.session.UserId) } })).length;
		if (totalRow > 0) {
			quanTriVien = await QuanTriVien.aggregate([
				{ $match: { TaiKhoan: regex, _id: { '$ne': mongoose.Types.ObjectId(req.session.UserId) } } },
				{
					$lookup:
					{
						from: "trangthaisudungs",
						localField: "IdTrangThai",
						foreignField: "_id",
						as: "TenTrangThai"
					}
				},
				{
					$lookup:
					{
						from: "quyens",
						localField: "IdQuyen",
						foreignField: "_id",
						as: "TenQuyen"
					}
				},
				{
					$lookup:
					{
						from: "loaitaikhoans",
						localField: "IdLoaiTaiKhoan",
						foreignField: "_id",
						as: "LoaiTaiKhoan"
					}
				}
			]).sort({ TenQuanTriVien: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
		}
	}
	else {
		totalRow = (await QuanTriVien.find({ _id: { '$ne': mongoose.Types.ObjectId(req.session.UserId) }})).length;//ko search
		if (totalRow > 0) {
			quanTriVien = await QuanTriVien.aggregate([
				{ $match: { _id: { '$ne': mongoose.Types.ObjectId(req.session.UserId) } } },
				{
					$lookup:
					{
						from: "trangthaisudungs",
						localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
						foreignField: "_id",
						as: "TenTrangThai"
					}
				},
				{
					$lookup:
					{
						from: "quyens",
						localField: "IdQuyen",//Ban dau ko co truong IdTrangThai trong db => error
						foreignField: "_id",
						as: "TenQuyen"
					}
				},
				{
					$lookup:
					{
						from: "loaitaikhoans",
						localField: "IdLoaiTaiKhoan",
						foreignField: "_id",
						as: "LoaiTaiKhoan"
					}
				}
			]).sort({ TenQuanTriVien: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
		}
	}
	res.json({ status: "true", data: quanTriVien, categoryStatus: trangThaiSuDung, totalRow: totalRow, listRole: quyen });
});

router.post('/LoadDetail', async (req, res) => {
	var ID = mongoose.Types.ObjectId(req.body.id);
	var quanTriVien;
	quanTriVien = await QuanTriVien.aggregate([
		{ $match: { _id: ID } },
		{
			$lookup:
			{
				from: "trangthaisudungs",
				localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenTrangThai"
			}
		},
		{
			$lookup:
			{
				from: "quyens",
				localField: "IdQuyen",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenQuyen"
			}
		}
	]);//lay du lieu ung voi so trang
	res.json({ status: "true", data: quanTriVien });
});
router.post('/Update', async (req, res) => {
	var quanTriVien = await QuanTriVien.find({ _id: req.body.modelUpdate[0]._id });
	if (quanTriVien != null) {
		try {
			const updateItem = await QuanTriVien.updateOne(
				{ _id: req.body.modelUpdate[0]._id },
				{
					$set: {
						TenQuanTriVien: req.body.modelUpdate[0].TenQuanTriVien,
						Email: req.body.modelUpdate[0].Email,
						DiaChi: req.body.modelUpdate[0].DiaChi,
						SoDienThoai: req.body.modelUpdate[0].SoDienThoai,
						IdQuyen: req.body.modelUpdate[0].IdQuyen,
						IdTrangThai: req.body.modelUpdate[0].IdTrangThai
					}
				}
			);
			res.json({ status: "true" });
		} catch (err) {
			res.json({ status: "error" });
		}
	}
	else
		res.json({ status: "false" });
});
router.post('/Create', async (req, res) => {
	var TaiKhoan = req.body.modelCreate[0].TaiKhoan;
	var MatKhau = req.body.modelCreate[0].MatKhau;
	var TenQuanTriVien = req.body.modelCreate[0].TenQuanTriVien;
	var Email = req.body.modelCreate[0].Email;
	var DiaChi = req.body.modelCreate[0].DiaChi;
	var SoDienThoai = req.body.modelCreate[0].SoDienThoai;
	var IdQuyen = req.body.modelCreate[0].IdQuyen;
	var IdTrangThai = req.body.modelCreate[0].IdTrangThai;
	var quanTriVien = new QuanTriVien({
		TaiKhoan: TaiKhoan,
		MatKhau: MatKhau,
		TenQuanTriVien: TenQuanTriVien,
		Email: Email,
		DiaChi: DiaChi,
		SoDienThoai: SoDienThoai,
		IdQuyen: IdQuyen,
		IdTrangThai: IdTrangThai,
		IsDeleted: false,
		IdLoaiTaiKhoan: '5de3427c1c9d440000dd4ebf',
		ModifiedBy: req.session.UserId,
		ModifiedDate: Date.now(),
		CreatedBy: req.session.UserId,
		CreatedDate: Date.now()
	});
	var quanTriVienCompare = (await QuanTriVien.find({ TaiKhoan: TaiKhoan, IdLoaiTaiKhoan: '5de3427c1c9d440000dd4ebf' })).length;
	if (quanTriVienCompare == 0) {
		try {
			const saveQuanTriVien = await quanTriVien.save();
			res.json({ status: "true" });
		} catch{
			res.json({ status: "error" });
		}
	}
	else {
		res.json({ status: "false" });
	}

});
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
module.exports = router;
