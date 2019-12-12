'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var TacGia = require('../../models/TacGia');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var Sach = require('../../models/Sach');
/* GET users listing. */
router.get('/', function (req, res) {
	res.render('QuanLyTacGia/QuanLyTacGia.html');
});
router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;//Tên Danh M?c c?n tìm
	var page = req.body.page;//S? trang ?ang ch?n
	var pageSize = req.body.pageSize;//S? dòng d? li?u hi?n th? trên 1 trang
	var totalRow;//Tong so dong de phan trang
	var tacGia;
	var trangThaiSuDung = await TrangThaiSuDung.find({});
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await TacGia.find({ TenTacGia: regex, IsBookStore: true })).length;//co search
			if (totalRow > 0) {
				tacGia = await TacGia.aggregate([
					{ $match: { TenTacGia: regex, IsBookStore: true } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}
				]).sort({ TenTacGia: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await TacGia.find({ IsBookStore: true })).length;//ko search
			if (totalRow > 0) {
				tacGia = await TacGia.aggregate([
					{ $match: { IsBookStore: true } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}]).sort({ TenTacGia: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	if (req.session.Quyen == 'User') {
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await TacGia.find({ TenTacGia: regex, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) })).length;//co search
			if (totalRow > 0) {
				tacGia = await TacGia.aggregate([
					{ $match: { TenTacGia: regex, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}
				]).sort({ TenTacGia: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await TacGia.find({ CreatedBy: mongoose.Types.ObjectId(req.session.UserId) })).length;//ko search
			if (totalRow > 0) {
				tacGia = await TacGia.aggregate([
					{ $match: { CreatedBy: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}]).sort({ TenTacGia: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	
	res.json({ status: "true", data: tacGia, categoryStatus: trangThaiSuDung, totalRow: totalRow });
});

router.post('/LoadDetail', async (req, res) => {
	var ID = mongoose.Types.ObjectId(req.body.id);
	var tacGia;
	var trangThaiSuDung = await TrangThaiSuDung.find({});
	tacGia = await TacGia.aggregate([
		{ $match: { _id: ID } },
		{
			$lookup:
			{
				from: "trangthaisudungs",
				localField: "IdTrangThai",
				foreignField: "_id",
				as: "TenTrangThai"
			}
		}
	]);
	res.json({ status: "true", data: tacGia, categoryStatus: trangThaiSuDung });
});
router.post('/Update', async (req, res) => {
	//TH1: TenDanhMuc khong thay doi
	var first = await TacGia.find({ _id: req.body.modelUpdate[0]._id });
	if (first[0].TenTacGia == req.body.modelUpdate[0].TenTacGia) {
		try {
			const updateItem = await TacGia.updateOne(
				{ _id: req.body.modelUpdate[0]._id },
				{
					$set: {
						TenTacGia: req.body.modelUpdate[0].TenTacGia,
						MoTa: req.body.modelUpdate[0].MoTa,
						IdTrangThai: req.body.modelUpdate[0].IdTrangThai,
						ModifiedBy: req.session.UserId,
						ModifiedDate: Date.now()
					}
				}
			);
			res.json({ status: "true" });
		} catch (err) {
			res.json({ status: "error" });
		}
	}
	//TH2: TenDanhMuc thay doi
	else {
		var compare = (await TacGia.find({ TenDanhMuc: req.body.modelUpdate[0].TenTacGia })).length;
		if (compare == 0) {
			try {
				const updateItem = await TacGia.updateOne(
					{ _id: req.body.modelUpdate[0]._id },
					{
						$set: {
							TenTacGia: req.body.modelUpdate[0].TenTacGia,
							MoTa: req.body.modelUpdate[0].MoTa,
							IdTrangThai: req.body.modelUpdate[0].IdTrangThai,
							ModifiedBy: req.session.UserId,
							ModifiedDate: Date.now()
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
	}
});
router.post('/Create', async (req, res) => {
	var TenTacGia = req.body.modelCreate[0].TenTacGia;
	var MoTa = req.body.modelCreate[0].MoTa;
	var IdTrangThai = req.body.modelCreate[0].IdTrangThai;
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		var tacGia = new TacGia({
			TenTacGia: TenTacGia,
			MoTa: MoTa,
			IdTrangThai: IdTrangThai,
			IsDeleted: false,
			IsBookStore: true,
			ModifiedBy: req.session.UserId,
			ModifiedDate: Date.now(),
			CreatedBy: req.session.UserId,
			CreatedDate: Date.now()
		});
	}
	if (req.session.Quyen == 'User') {
		var tacGia = new TacGia({
			TenTacGia: TenTacGia,
			MoTa: MoTa,
			IdTrangThai: IdTrangThai,
			IsDeleted: false,
			IsBookStore: false,
			ModifiedBy: req.session.UserId,
			ModifiedDate: Date.now(),
			CreatedBy: req.session.UserId,
			CreatedDate: Date.now()
		});
	}
	var danhMucCompare = (await TacGia.find({ TenTacGia: TenTacGia })).length;
	if (danhMucCompare == 0) {
		try {
			const saveTacGia = await tacGia.save();
			res.json({ status: 'true' });
		} catch{
			res.json({ status: 'error' });
		}
	}
	else {
		res.json({ status: 'false' });
	}
});
router.post('/Delete', async (req, res) => {
	var id = mongoose.Types.ObjectId(req.body.id);
	var sach = (await Sach.find({ IdTacGia: id })).length;
	if (sach == 0) {
		try {
			const remove = await TacGia.remove({ _id: id });
			res.json({ status: 'true' });
		} catch{
			res.json({ status: 'error' });
		}
	}
	else
		res.json({ status: 'false' });
});
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
