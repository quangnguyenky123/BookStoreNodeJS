'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sach = require('../../models/Sach');
var NhaXuatBan = require('../../models/NhaXuatBan');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var PhieuNhapSach = require('../../models/PhieuNhapSach');
/* GET users listing. */
router.get('/', function (req, res) {
	//var trangThaiSuDung = await TrangThaiSuDung.find({});
	res.render('QuanLyNhaXuatBan/QuanLyNhaXuatBan.html');
});
router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;//Tên Danh M?c c?n tìm
	var page = req.body.page;//S? trang ?ang ch?n
	var pageSize = req.body.pageSize;//S? dòng d? li?u hi?n th? trên 1 trang
	var totalRow;//Tong so dong de phan trang
	var nhaXuatBan;
	var trangThaiSuDung = await TrangThaiSuDung.find({});
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await NhaXuatBan.find({ TenNhaXuatBan: regex, IsBookStore: true  })).length;
			if (totalRow > 0) {
				nhaXuatBan = await NhaXuatBan.aggregate([
					{ $match: { TenNhaXuatBan: regex, IsBookStore: true  } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}
				]).sort({ TenNhaXuatBan: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await NhaXuatBan.find({ IsBookStore: true  })).length;//ko search
			if (totalRow > 0) {
				nhaXuatBan = await NhaXuatBan.aggregate([
					{ $match: { IsBookStore: true  } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}]).sort({ TenNhaXuatBan: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	if (req.session.Quyen == 'User') {
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await NhaXuatBan.find({ TenNhaXuatBan: regex, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) })).length;
			if (totalRow > 0) {
				nhaXuatBan = await NhaXuatBan.aggregate([
					{ $match: { TenNhaXuatBan: regex, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}
				]).sort({ TenNhaXuatBan: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await NhaXuatBan.find({ CreatedBy: mongoose.Types.ObjectId(req.session.UserId) })).length;//ko search
			if (totalRow > 0) {
				nhaXuatBan = await NhaXuatBan.aggregate([
					{ $match: { CreatedBy: mongoose.Types.ObjectId(req.session.UserId) } },
					{
						$lookup:
						{
							from: "trangthaisudungs",
							localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
							foreignField: "_id",
							as: "TenTrangThai"
						}
					}]).sort({ TenNhaXuatBan: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
	}
	res.json({ status: "true", data: nhaXuatBan, categoryStatus: trangThaiSuDung, totalRow: totalRow });
});

router.post('/LoadDetail', async (req, res) => {
	var ID = mongoose.Types.ObjectId(req.body.id);
	var nhaXuatBan;
	var trangThaiSuDung = await TrangThaiSuDung.find({});
	nhaXuatBan = await NhaXuatBan.aggregate([
		{ $match: { _id: ID } },
		{
			$lookup:
			{
				from: "trangthaisudungs",
				localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenTrangThai"
			}
		}
	]);//lay du lieu ung voi so trang
	res.json({ status: "true", data: nhaXuatBan, categoryStatus: trangThaiSuDung });
});
router.post('/Update', async (req, res) => {
	//TH1: TenNhaXuatBan khong thay doi
	var first = await NhaXuatBan.find({ _id: req.body.modelUpdate[0]._id });
	if (first[0].TenNhaXuatBan == req.body.modelUpdate[0].TenNhaXuatBan) {
		try {
			const updateItem = await NhaXuatBan.updateOne(
				{ _id: req.body.modelUpdate[0]._id },
				{
					$set: {
						MoTa: req.body.modelUpdate[0].MoTa,
						IdTrangThai: req.body.modelUpdate[0].IdTrangThai
					}
				}
			);
			res.json({ status: "true" });
		} catch (err) {
		}
	}
	//TH2: TenNhaXuatBan thay doi
	else {
		var compare = (await NhaXuatBan.find({ TenNhaXuatBan: req.body.modelUpdate[0].TenNhaXuatBan })).length;
		if (compare == 0) {
			try {
				const updateItem = await NhaXuatBan.updateOne(
					{ _id: req.body.modelUpdate[0]._id },
					{
						$set: {
							TenNhaXuatBan: req.body.modelUpdate[0].TenNhaXuatBan,
							MoTa: req.body.modelUpdate[0].MoTa,
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
	}
});
router.post('/Create', async (req, res) => {
	var TenNhaXuatBan = req.body.modelCreate[0].TenNhaXuatBan;
	var MoTa = req.body.modelCreate[0].MoTa;
	var IdTrangThai = req.body.modelCreate[0].IdTrangThai;
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		var nhaXuatBan = new NhaXuatBan({
			TenNhaXuatBan: TenNhaXuatBan,
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
		var nhaXuatBan = new NhaXuatBan({
			TenNhaXuatBan: TenNhaXuatBan,
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
	var nhaXuatBanCompare = (await NhaXuatBan.find({ TenNhaXuatBan: TenNhaXuatBan })).length;
	if (nhaXuatBanCompare == 0) {
		try {
			const saveNhaXuatBan = await nhaXuatBan.save();
			res.json({ status: "true" });
		} catch{
			res.json({ status: "error" });
		}
	}
	else {
		res.json({ status: "false" });
	}

});
router.post('/Delete', async (req, res) => {
	var id = req.body.id;
	var phieuNhapSach = (await PhieuNhapSach.find({ IdNXB: id })).length;
	var sachComapare = (await Sach.find({ IdNXB: id })).length; //Thieu trang thai, IsDeleted
	if (sachComapare == 0 && phieuNhapSach == 0) {
		var nhaXuatBanCompare = (await NhaXuatBan.find({ _id: id })).length;
		{
			if (nhaXuatBanCompare == 1) {
				try {
					const deleteNhaXuatBan = await NhaXuatBan.remove({ _id: id });
					res.json({ status: "true" });
				} catch{
					res.json({ status: "error" });
				}
			}
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
