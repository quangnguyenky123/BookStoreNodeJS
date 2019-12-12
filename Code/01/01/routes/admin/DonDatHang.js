'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sach = require('../../models/Sach');
var TrangThaiGiaoHang = require('../../models/TrangThaiGiaoHang');
var DonDatHang = require('../../models/DonDatHang');
var ChiTietDonDatHang = require('../../models/ChiTietDonDatHang');
router.get('/', function (req, res) {
	res.render('QuanLyDonHang/QuanLyDonHang.html');
});
router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;
	var page = req.body.page;
	var pageSize = req.body.pageSize;
	var totalRow;
	var donDatHang;
	var trangThaiGiaoHang = await TrangThaiGiaoHang.find({});
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await DonDatHang.find({ MaSoDonDatHang: regex, IsBookStoreSale: true })).length;
			if (totalRow > 0) {
				donDatHang = await DonDatHang.aggregate([
					{ $match: { MaSoDonDatHang: regex, IsBookStoreSale: true } },
					{
						$lookup:
						{
							from: "trangthaigiaohangs",
							localField: "IdTrangThaiGiaoHang",
							foreignField: "_id",
							as: "TrangThaiGiaoHang"
						}
					},
					{
						$lookup:
						{
							from: "quantriviens",
							localField: "IdKhachHang",
							foreignField: "_id",
							as: "KhachHang"
						}
					}
				]).sort({ MaSoDonDatHang: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await DonDatHang.find({ IsBookStoreSale: true })).length;//ko search
			if (totalRow > 0) {
				donDatHang = await DonDatHang.aggregate([
					{ $match: { IsBookStoreSale: true } },
					{
						$lookup:
						{
							from: "trangthaigiaohangs",
							localField: "IdTrangThaiGiaoHang",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TrangThaiGiaoHang"
						}
					},
					{
						$lookup:
						{
							from: "quantriviens",
							localField: "IdKhachHang",
							foreignField: "_id",
							as: "KhachHang"
						}
					}
				]).sort({ MaSoDonDatHang: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	if (req.session.Quyen == 'User') {
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await DonDatHang.find({ MaSoDonDatHang: regex, IdNguoiBan: mongoose.Types.ObjectId(req.session.UserId) })).length;
			if (totalRow > 0) {
				donDatHang = await DonDatHang.aggregate([
					{ $match: { MaSoDonDatHang: regex, IdNguoiBan: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaigiaohangs",
							localField: "IdTrangThaiGiaoHang",
							foreignField: "_id",
							as: "TrangThaiGiaoHang"
						}
					},
					{
						$lookup:
						{
							from: "quantriviens",
							localField: "IdKhachHang",
							foreignField: "_id",
							as: "KhachHang"
						}
					}
				]).sort({ MaSoDonDatHang: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await DonDatHang.find({ IdNguoiBan: mongoose.Types.ObjectId(req.session.UserId) })).length;//ko search
			if (totalRow > 0) {
				donDatHang = await DonDatHang.aggregate([
					{ $match: { IdNguoiBan: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaigiaohangs",
							localField: "IdTrangThaiGiaoHang",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TrangThaiGiaoHang"
						}
					},
					{
						$lookup:
						{
							from: "quantriviens",
							localField: "IdKhachHang",
							foreignField: "_id",
							as: "KhachHang"
						}
					}
				]).sort({ MaSoDonDatHang: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	res.json({ status: "true", data: donDatHang, trangThaiGiaoHang: trangThaiGiaoHang, totalRow: totalRow });
});

router.post('/LoadDetail', async (req, res) => {
	var ID = mongoose.Types.ObjectId(req.body.id);
	var donDatHang;
	donDatHang = await DonDatHang.aggregate([
		{ $match: { _id: ID } },
		{
			$lookup:
			{
				from: "quantriviens",
				localField: "IdKhachHang",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "KhachHang"
			}
		}
	]);//lay du lieu ung voi so trang
	var chiTietDonDatHang = await ChiTietDonDatHang.aggregate([
		{ $match: { IdDonDatHang: ID } },
		{
			$lookup:
			{
				from: "saches",
				localField: "IdSach",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "Sach"
			}
		}
	]);
	res.json({ status: "true", data: donDatHang, matHang: chiTietDonDatHang });
});
router.post('/Update', async (req, res) => {
	console.log(req.body.modelUpdate[0].NgayGiao);
	try {
		const updateItem = await DonDatHang.updateOne(
			{ _id: req.body.modelUpdate[0]._id },
			{
				$set: {
					NgayGiao: req.body.modelUpdate[0].NgayGiao,
					IdTrangThaiGiaoHang: req.body.modelUpdate[0].IdTrangThaiGiaoHang,
					ModifiedBy: req.session.UserId,
					ModifiedDate: Date.now()
				}
			}
		);
		res.json({ status: true });
	} catch (err) {
		res.json({ status: false });
	}
});
//router.post('/Create', async (req, res) => {
//	var TenDanhMuc = req.body.modelCreate[0].TenDanhMuc;
//	var MoTa = req.body.modelCreate[0].MoTa;
//	var IdTrangThai = req.body.modelCreate[0].IdTrangThai;
//	var danhMuc = new DanhMuc({
//		TenDanhMuc: TenDanhMuc,
//		MoTa: MoTa,
//		IdTrangThai: IdTrangThai,
//		IsDeleted: false,
//		ModifiedBy: req.session.UserId,
//		ModifiedDate: Date.now(),
//		CreatedBy: req.session.UserId,
//		CreatedDate: Date.now()
//	});
//	var danhMucCompare = (await DanhMuc.find({ TenDanhMuc: TenDanhMuc })).length;
//	if (danhMucCompare == 0) {
//		try {
//			const saveDanhMuc = await danhMuc.save();
//			res.json({ status: "true" });
//		} catch{
//			res.json({ status: "error" });
//		}
//	}
//	else {
//		res.json({ status: "false" });
//	}

//});
//router.post('/Delete', async (req, res) => {
//	var id = req.body.id;
//	//Kiem tra danh muc co sach hay khong
//	var sachComapare = (await Sach.find({ IdDanhMuc: id })).length; //Thieu trang thai, IsDeleted
//	if (sachComapare == 0) {
//		var danhMucCompare = (await DanhMuc.find({ _id: id })).length;
//		{
//			if (danhMucCompare == 1) {
//				try {
//					const deleteDanhMuc = await DanhMuc.remove({ _id: id });
//					res.json({ status: "true" });
//				} catch{
//					res.json({ status: "error" });
//				}
//			}
//		}
//	}
//	else {
//		res.json({ status: "false" });
//	}

//});
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.:'",\\^$|#\s]/g, "\\$&");
};
function Clean(text) {
	return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};
module.exports = router;
