'use strict';
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Sach = require('../../models/Sach');
var QuanTriVien = require('../../models/QuanTriVien');
var TrangThaiChapNhan = require('../../models/TrangThaiChapNhan');




/* GET users listing. */
router.get('/', function (req, res) {
	res.render('QuanLyPheDuyetSach/QuanLyPheDuyetSach.html');
});
router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;
	var page = req.body.page;
	var pageSize = req.body.pageSize;
	var totalRow;
	var trangThaiChapNhan = await TrangThaiChapNhan.find();
	var sach;
	if (searchString != "") {
		const regex = new RegExp(escapeRegex(searchString), 'gi');
		totalRow = (await Sach.find({ TenSach: regex })).length;
		if (totalRow > 0) {
			sach = await Sach.aggregate([
				{ $match: { TenSach: regex } },
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
			]).sort({ TrangThaiChapNhan: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
		}
	}
	else {
		totalRow = (await Sach.find({})).length;//ko search
		if (totalRow > 0) {
			sach = await Sach.aggregate([
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
				}]).sort({ TrangThaiChapNhan: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
		}
	}
	res.json({ status: true, data: sach, trangThaiChapNhan: trangThaiChapNhan,  totalRow: totalRow });
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
		},
		{
			$lookup:
			{
				from: "quantriviens",
				localField: "CreatedBy",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "QuanTriVien"
			}
		},
		{
			$lookup:
			{
				from: "quantriviens",
				localField: "ConfirmedBy",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "ConfirmedBy"
			}
		}
	]);//lay du lieu ung voi so trang
	res.json({ status: true, data: sach});
});
//router.post('/UpdateFile', upload.single('HinhAnh'), async (req, res) => {
//	inputFileName = req.file.filename;
//	if (inputFileName != null && inputFileName != '') {
//		res.json({ status: "true" });
//	}
//	else
//		res.json({ status: 'false' })
//});
router.post('/Update', async (req, res) => {
	try {
		const updateItem = await Sach.updateOne(
			{ _id: req.body.modelUpdate[0]._id },
			{
				$set: {
					IdTrangThaiChapNhan: req.body.modelUpdate[0].IdTrangThaiChapNhan,
					ConfirmedBy: req.session.UserId,
					ConfirmedDate: Date.now(),
					ModifiedBy: req.session.UserId,
					ModifiedDate: Date.now(),
				}
			}
		);
		res.json({ status: true });
	} catch (err) {
		res.json({ status: false });
	}
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.:'",\\^$|#\s]/g, "\\$&");
};
function Clean(text) {
	return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};
module.exports = router;
