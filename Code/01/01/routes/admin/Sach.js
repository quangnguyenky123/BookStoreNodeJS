'use strict';
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Sach = require('../../models/Sach');
var QuanTriVien = require('../../models/QuanTriVien');
var DanhMuc = require('../../models/DanhMuc');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var NhaXuatBan = require('../../models/NhaXuatBan');
var TacGia = require('../../models/TacGia');
var TrangThaiSach = require('../../models/TrangThaiSach');
var ChiTietDonDatHang = require('../../models/ChiTietDonDatHang');
var ChiTietPhieuNhapSach = require('../../models/ChiTietPhieuNhapSach');
var multer = require('multer');



const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/HinhAnhSach/');
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + '_' + file.originalname);
	}
});
const upload = multer({ storage: storage });
/* GET users listing. */
router.get('/', function (req, res) {
	res.render('QuanLySach/QuanLySach.html');
});
router.post('/LoadEmpty', async (req, res) => {
	var trangThaiSuDung = await TrangThaiSuDung.find({ _id: '5dd6c4d03d9bfe5770f9911e' });
	var danhMuc = await DanhMuc.find({ IdTrangThai: trangThaiSuDung[0]._id});
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		var tacGia = await TacGia.find({ IdTrangThai: trangThaiSuDung[0]._id, IsBookStore: true });
		var nhaXuatBan = await NhaXuatBan.find({ IdTrangThai: trangThaiSuDung[0]._id, IsBookStore: true });
	}
	if (req.session.Quyen == 'User') {
		var tacGia = await TacGia.find({ IdTrangThai: trangThaiSuDung[0]._id, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) });
		var nhaXuatBan = await NhaXuatBan.find({ IdTrangThai: trangThaiSuDung[0]._id, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) });
	}

	var trangThaiSach = await TrangThaiSach.find({});
	if (danhMuc.length == 0) {
		res.json({ status: "NoDanhMuc" });
	}
	if (tacGia.length == 0) {
		res.json({ status: "NoTacGia" });
	}
	if (nhaXuatBan.length == 0) {
		res.json({ status: "NoNhaXuatBan" });
	}
	else {
		var sach = [{
			TenSach: '',
			IdTacGia: tacGia[0]._id,
			IdNXB: nhaXuatBan[0]._id,
			IdDanhMuc: danhMuc[0]._id,
			Tap: null,
			SoLuong: 0,
			Gia: 0,
			TomTat: '',
			IdTrangThai: trangThaiSach[0]._id,
			SoLuotMua: 0
		}];
		req.session.inputFileName = "";
		res.json({ status: true, data: sach });
	}
	
});
router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;
	var page = req.body.page;
	var pageSize = req.body.pageSize;
	var totalRow;
	var trangThaiSuDung = await TrangThaiSuDung.find({ _id: "5dd6c4d03d9bfe5770f9911e" });
	var danhMuc = await DanhMuc.find({ IdTrangThai: trangThaiSuDung[0]._id });////Câ?n thay ?ô?i
	var trangThaiSach = await TrangThaiSach.find({});
	var sach; 
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		var tacGia = await TacGia.find({ IdTrangThai: trangThaiSuDung[0]._id, IsBookStore: true });
		var nhaXuatBan = await NhaXuatBan.find({ IdTrangThai: trangThaiSuDung[0]._id, IsBookStore: true });
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await Sach.find({ TenSach: regex, IsBookStore: true })).length;
			if (totalRow > 0) {
				sach = await Sach.aggregate([
					{ $match: { TenSach: regex, IsBookStore: true } },
					{
						$lookup:
						{
							from: "trangthaisaches",
							localField: "IdTrangThai",
							foreignField: "_id",
							as: "TenTrangThai"
						}
					},
					{
						$lookup:
						{
							from: "trangthaichapnhans",
							localField: "IdTrangThaiChapNhan",
							foreignField: "_id",
							as: "TrangThaiChapNhan"
						}
					}
				]).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await Sach.find({ IsBookStore: true })).length;//ko search
			if (totalRow > 0) {
				sach = await Sach.aggregate([
					{ $match: { IsBookStore: true } },
					{
						$lookup:
						{
							from: "trangthaisaches",
							localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TenTrangThai"
						}
					},
					{
						$lookup:
						{
							from: "trangthaichapnhans",
							localField: "IdTrangThaiChapNhan",
							foreignField: "_id",
							as: "TrangThaiChapNhan"
						}
					}]).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	if (req.session.Quyen == 'User') {
		var tacGia = await TacGia.find({ IdTrangThai: trangThaiSuDung[0]._id, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) });
		var nhaXuatBan = await NhaXuatBan.find({ IdTrangThai: trangThaiSuDung[0]._id, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) });
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await Sach.find({ TenSach: regex, CreatedBy: req.session.UserId })).length;
			if (totalRow > 0) {
				sach = await Sach.aggregate([
					{ $match: { TenSach: regex, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaisaches",
							localField: "IdTrangThai",
							foreignField: "_id",
							as: "TenTrangThai"
						}
					},
					{
						$lookup:
						{
							from: "trangthaichapnhans",
							localField: "IdTrangThaiChapNhan",
							foreignField: "_id",
							as: "TrangThaiChapNhan"
						}
					}
				]).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await Sach.find({ CreatedBy: req.session.UserId })).length;//ko search
			if (totalRow > 0) {
				sach = await Sach.aggregate([
					{ $match: { CreatedBy: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaisaches",
							localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TenTrangThai"
						}
					},
					{
						$lookup:
						{
							from: "trangthaichapnhans",
							localField: "IdTrangThaiChapNhan",
							foreignField: "_id",
							as: "TrangThaiChapNhan"
						}
					}]).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	res.json({ status: "true", data: sach, trangThaiSach: trangThaiSach, danhMuc: danhMuc, tacGia: tacGia, nhaXuatBan: nhaXuatBan, totalRow: totalRow, });
});

router.post('/LoadDetail', async (req, res) => {
	var ID = mongoose.Types.ObjectId(req.body.id);
	var sach;
	//var trangThaiSuDung = await TrangThaiSuDung.find({});
	sach = await Sach.aggregate([
		{ $match: { _id: ID } },
		{
			$lookup:
			{
				from: "trangthaisaches",
				localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenTrangThai"
			}
		},
		{
			$lookup:
			{
				from: "tacgias",
				localField: "IdTacGia",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenTacGia"
			}
		},
		{
			$lookup:
			{
				from: "nhaxuatbans",
				localField: "IdNXB",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenNhaXuatBan"
			}
		},
		{
			$lookup:
			{
				from: "danhmucs",
				localField: "IdDanhMuc",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenDanhMuc"
			}
		}
	]);//lay du lieu ung voi so trang
	res.json({ status: "true", data: sach});
});
router.post('/UpdateFile', upload.single('HinhAnh'), async (req, res) => {
	var filename2 = req.file.filename;
	req.session.inputFileName = filename2;
	if (req.session.inputFileName != null && req.session.inputFileName != "" && req.session.inputFileName != undefined) {
		res.json({ status: "true" });
	}
	else
		res.json({ status: 'false' })
});
router.post('/Update', async (req, res) => {
	//Change image
	if (req.session.inputFileName != '' && req.session.inputFileName != null && req.session.inputFileName != undefined) {
		try {
			const updateItem = await Sach.updateOne(
				{ _id: req.body.modelUpdate[0]._id },
				{
					$set: {
						TenSach: req.body.modelUpdate[0].TenSach,
						IdTacGia: req.body.modelUpdate[0].IdTacGia,
						IdNXB: req.body.modelUpdate[0].IdNXB,
						IdDanhMuc: req.body.modelUpdate[0].IdDanhMuc,
						Tap: req.body.modelUpdate[0].Tap,
						Gia: req.body.modelUpdate[0].Gia,
						TomTat: req.body.modelUpdate[0].TomTat,
						IdTrangThai: req.body.modelUpdate[0].IdTrangThai,
						HinhAnh: req.session.inputFileName,
						ModifiedBy: req.session.UserId,
						ModifiedDate: Date.now(),
					}
				}
			);
			req.session.inputFileName = null;
			res.json({ status: "true" });
		} catch (err) {
			res.json({ status: "error" });
		}
	}
	//Don't Change image
	else {
		try {
			const updateItem = await Sach.updateOne(
				{ _id: req.body.modelUpdate[0]._id },
				{
					$set: {
						TenSach: req.body.modelUpdate[0].TenSach,
						IdTacGia: req.body.modelUpdate[0].IdTacGia,
						IdNXB: req.body.modelUpdate[0].IdNXB,
						IdDanhMuc: req.body.modelUpdate[0].IdDanhMuc,
						Tap: req.body.modelUpdate[0].Tap,
						Gia: req.body.modelUpdate[0].Gia,
						TomTat: req.body.modelUpdate[0].TomTat,
						IdTrangThai: req.body.modelUpdate[0].IdTrangThai,
						ModifiedBy: req.session.UserId,
						ModifiedDate: Date.now(),
					}
				}
			);
			res.json({ status: "true" });
		} catch (err) {
			res.json({ status: "error" });
		}
	}
});

router.post('/CreateFile', upload.single('HinhAnh'),  async (req, res) => {
	var filename1 = req.file.filename;
	req.session.inputFileName = filename1;
	if (req.session.inputFileName != null && req.session.inputFileName != '' && req.session.inputFileName != undefined) {
		res.json({ status: 'true' });
	}
	else
		res.json({ status:'false' })
});
router.post('/Create', async (req, res) => {
	var totalSach = (await Sach.find({})).length;
	var quanTriVien = await QuanTriVien.aggregate([
		{ $match: { _id: mongoose.Types.ObjectId(req.session.UserId) } },
		{
			$lookup:
			{
				from: "quyens",
				localField: "IdQuyen",
				foreignField: "_id",
				as: "Quyen"
			}
		}
	]);
	var IdTrangThaiChapNhan;
	var ConfirmedBy;
	var ConfirmedDate;
	var quyen = quanTriVien[0].Quyen[0].TenQuyen;
	if (quyen == "Admin" || quyen == "Employee") {
		IdTrangThaiChapNhan = mongoose.Types.ObjectId("5de901f91c9d4400003a88d0");
		ConfirmedBy = req.session.UserId;
		ConfirmedDate = Date.now();
		if (req.session.inputFileName != '' && req.session.inputFileName != null) {
			var sach = new Sach({
				MaSoSach: "MSS0" + String(totalSach + 1),
				TenSach: req.body.modelCreate[0].TenSach,
				IdTacGia: req.body.modelCreate[0].IdTacGia,
				IdNXB: req.body.modelCreate[0].IdNXB,
				IdDanhMuc: req.body.modelCreate[0].IdDanhMuc,
				Tap: req.body.modelCreate[0].Tap,
				SoLuong: 0,
				Gia: req.body.modelCreate[0].Gia,
				TomTat: req.body.modelCreate[0].TomTat,
				IdTrangThai: req.body.modelCreate[0].IdTrangThai,
				HinhAnh: req.session.inputFileName,
				SoLuotMua: 0,
				NgayThem: Date.now(),
				IdTrangThaiChapNhan: IdTrangThaiChapNhan,
				ConfirmedBy : ConfirmedBy,
				ConfirmedDate : ConfirmedDate,
				IsDeleted: false,
				IsBookStore: true,
				ModifiedBy: req.session.UserId,
				ModifiedDate: Date.now(),
				CreatedBy: req.session.UserId,
				CreatedDate: Date.now()
			});
			try {
				const saveSach = await sach.save();
				req.session.inputFileName = null;
				res.json({ status: "true" });
			} catch{
				res.json({ status: "error" });
			}
		}
		else
			res.json({ status: "false" });
	}
	if (quyen == "User") {
		IdTrangThaiChapNhan = mongoose.Types.ObjectId("5de901d21c9d4400003a88ce");
		if (req.session.inputFileName != '' && req.session.inputFileName != null) {
			var sach = new Sach({
				MaSoSach: "MSS0" + String(totalSach + 1),
				TenSach: req.body.modelCreate[0].TenSach,
				IdTacGia: req.body.modelCreate[0].IdTacGia,
				IdNXB: req.body.modelCreate[0].IdNXB,
				IdDanhMuc: req.body.modelCreate[0].IdDanhMuc,
				Tap: req.body.modelCreate[0].Tap,
				SoLuong: 0,
				Gia: req.body.modelCreate[0].Gia,
				TomTat: req.body.modelCreate[0].TomTat,
				IdTrangThai: req.body.modelCreate[0].IdTrangThai,
				HinhAnh: req.session.inputFileName,
				SoLuotMua: 0,
				NgayThem: Date.now(),
				IdTrangThaiChapNhan: IdTrangThaiChapNhan,
				//ConfirmedBy : ConfirmedBy,
				//ConfirmedDate : ConfirmedDate,
				IsDeleted: false,
				IsBookStore: false,
				ModifiedBy: req.session.UserId,
				ModifiedDate: Date.now(),
				CreatedBy: req.session.UserId,
				CreatedDate: Date.now()
			});
			try {
				const saveSach = await sach.save();
				req.session.inputFileName = null;
				res.json({ status: "true" });
			} catch{
				res.json({ status: "error" });
			}
		}
		else
			res.json({ status: "false" });
	}
	
});
router.post('/Delete', async (req, res) => {
	var id = req.body.id;
	var chiTietDonDatHang = (await ChiTietDonDatHang.find({ IdSach: id })).length;
	var chiTietPhieuNhapSach = (await ChiTietPhieuNhapSach.find({ IdSach: id })).length;
	if (chiTietDonDatHang == 0 && chiTietPhieuNhapSach == 0) {
		try {
			const deleteSach = await Sach.remove({ _id: id });
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
	return text.replace(/[-[\]{}()*+?.:'",\\^$|#\s]/g, "\\$&");
};
function Clean(text) {
	return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};
module.exports = router;
