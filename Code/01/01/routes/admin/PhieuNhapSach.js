'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sach = require('../../models/Sach');
var NhaXuatBan = require('../../models/NhaXuatBan');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var ChiTietPhieuNhapSach = require('../../models/ChiTietPhieuNhapSach');
var PhieuNhapSach = require('../../models/PhieuNhapSach');
/* GET users listing. */
router.get('/', function (req, res) {
	//console.log(req.session.UserId);
	//var trangThaiSuDung = await TrangThaiSuDung.find({});
	res.render('QuanLyNhapSach/QuanLyNhapSach.html');
});

router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;
	var page = req.body.page;
	var pageSize = req.body.pageSize;
    var totalRow;
	var phieuNhapSach;
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		var nhaXuatBan = await NhaXuatBan.find({ IdTrangThai: '5dd6c4d03d9bfe5770f9911e', IsBookStore: true });
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await PhieuNhapSach.find({ MaSoPhieuNhapSach: regex, IsBookStore: true })).length;
			if (totalRow > 0) {
				phieuNhapSach = await PhieuNhapSach.aggregate([
					{ $match: { MaSoPhieuNhapSach: regex, IsBookStore: true } },
				]).sort({ MaSoPhieuNhapSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await PhieuNhapSach.find({ IsBookStore: true })).length;//ko search
			if (totalRow > 0) {
				phieuNhapSach = await PhieuNhapSach.find({ IsBookStore: true }).sort({ MaSoPhieuNhapSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);
			}
		}
	}
	if (req.session.Quyen == 'User') {
		var nhaXuatBan = await NhaXuatBan.find({ IdTrangThai: '5dd6c4d03d9bfe5770f9911e', CreatedBy: mongoose.Types.ObjectId(req.session.UserId) });
		if (searchString != "") {
			const regex = new RegExp(escapeRegex(searchString), 'gi');
			totalRow = (await PhieuNhapSach.find({ MaSoPhieuNhapSach: regex, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) })).length;
			if (totalRow > 0) {
				phieuNhapSach = await PhieuNhapSach.aggregate([
					{ $match: { MaSoPhieuNhapSach: regex, CreatedBy: mongoose.Types.ObjectId(req.session.UserId) } },
				]).sort({ MaSoPhieuNhapSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
			}
		}
		else {
			totalRow = (await PhieuNhapSach.find({ CreatedBy: mongoose.Types.ObjectId(req.session.UserId) })).length;//ko search
			if (totalRow > 0) {
				phieuNhapSach = await PhieuNhapSach.find({ CreatedBy: mongoose.Types.ObjectId(req.session.UserId) }).sort({ MaSoPhieuNhapSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);
			}
		}
	}

	res.json({ status: "true", data: phieuNhapSach, nhaXuatBan: nhaXuatBan, totalRow: totalRow });
});

router.post('/LoadListBookByPublisher', async (req, res) => {
	var id = mongoose.Types.ObjectId(req.body.id);
	var sach = await Sach.find({ IdNXB: id });
	res.json({ data: sach});
});


router.post('/LoadDetail', async (req, res) => {
	var Id = req.body.id;
	var phieuNhapSach = await PhieuNhapSach.find({ _id: mongoose.Types.ObjectId(Id) });
	var chiTietPhieuNhapSach = await ChiTietPhieuNhapSach.aggregate([
		{ $match: { IdPhieuNhapSach: mongoose.Types.ObjectId(Id)} },
		{$lookup:
			{
				from: "saches",
				localField: "IdSach",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "Sach"
			}
		}
	]);//lay du lieu ung voi so trang
	res.json({ status: true, phieuNhapSach: phieuNhapSach, listBook: chiTietPhieuNhapSach });
});
//router.post('/Update', async (req, res) => {
//	//TH1: TenDanhMuc khong thay doi
//	var first = await DanhMuc.find({ _id: req.body.modelUpdate[0]._id });
//	if (first[0].TenDanhMuc == req.body.modelUpdate[0].TenDanhMuc) {
//		try {
//			const updateItem = await DanhMuc.updateOne(
//				{ _id: req.body.modelUpdate[0]._id },
//				{
//					$set: {
//						TenDanhMuc: req.body.modelUpdate[0].TenDanhMuc,
//						MoTa: req.body.modelUpdate[0].MoTa,
//						IdTrangThai: req.body.modelUpdate[0].IdTrangThai,
//						ModifiedBy: req.session.UserId,
//						ModifiedDate: Date.now(),
//					}
//				}
//			);
//			res.json({ status: "true" });
//		} catch (err) {
//			res.json({ status: "error" });
//		}
//	}
//	//TH2: TenDanhMuc thay doi
//	else {
//		var compare = (await DanhMuc.find({ TenDanhMuc: req.body.modelUpdate[0].TenDanhMuc })).length;
//		if (compare == 0) {
//			try {
//				const updateItem = await DanhMuc.updateOne(
//					{ _id: req.body.modelUpdate[0]._id },
//					{
//						$set: {
//							TenDanhMuc: req.body.modelUpdate[0].TenDanhMuc,
//							MoTa: req.body.modelUpdate[0].MoTa,
//							IdTrangThai: req.body.modelUpdate[0].IdTrangThai,
//							ModifiedBy: req.session.UserId,
//							ModifiedDate: Date.now(),
//						}
//					}
//				);
//				res.json({ status: "true" });
//			} catch (err) {
//				res.json({ status: "error" });
//			}
//		}
//		else
//			res.json({ status: "false" });
//	}
//});
router.post('/Create', async (req, res) => {
	var IdNhaXuatBan = req.body.IdNhaXuatBan;
	var nhaXuatBan = await NhaXuatBan.find({ _id: mongoose.Types.ObjectId(IdNhaXuatBan) });
	var listItem = req.body.listItem;
	var totalPhieuNhapSach = (await PhieuNhapSach.find()).length;
	var TongTien = 0;
	for (var i = 0; i < listItem.length; i++) {
		TongTien = TongTien + listItem[i].price * listItem[i].quantity;
	}
	var MaSoPhieuNhapSach = "PNS01-100000" + String(totalPhieuNhapSach + 1);
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		var phieuNhapSach = new PhieuNhapSach({
			MaSoPhieuNhapSach: MaSoPhieuNhapSach,
			IdNXB: IdNhaXuatBan,
			TenNhaXuatBan: nhaXuatBan[0].TenNhaXuatBan,
			NgayNhap: Date.now(),
			TongTien: TongTien,
			IsDeleted: false,
			IsBookStore: true,
			ModifiedBy: req.session.UserId,
			ModifiedDate: Date.now(),
			CreatedBy: req.session.UserId,
			CreatedDate: Date.now()
		});
	}
	if (req.session.Quyen == 'User') {
		var phieuNhapSach = new PhieuNhapSach({
			MaSoPhieuNhapSach: MaSoPhieuNhapSach,
			IdNXB: IdNhaXuatBan,
			TenNhaXuatBan: nhaXuatBan[0].TenNhaXuatBan,
			NgayNhap: Date.now(),
			TongTien: TongTien,
			IsDeleted: false,
			IsBookStore: false,
			ModifiedBy: req.session.UserId,
			ModifiedDate: Date.now(),
			CreatedBy: req.session.UserId,
			CreatedDate: Date.now()
		});
	}
	try {
		const savePhieuNhapSach = await phieuNhapSach.save();
		var IdPhieuNhapSach = String((await PhieuNhapSach.find({ MaSoPhieuNhapSach: MaSoPhieuNhapSach }))[0]._id);
		for (var j = 0; j < listItem.length; j++) {
			var chiTietPhieuNhapSach = new ChiTietPhieuNhapSach({
				IdPhieuNhapSach: IdPhieuNhapSach,
				IdSach: listItem[j].id,
				SoLuong: listItem[j].quantity,
				DonGia: listItem[j].price,
				IsDeleted: false,
				ModifiedBy: req.session.UserId,
				ModifiedDate: Date.now(),
				CreatedBy: req.session.UserId,
				CreatedDate: Date.now()
			});
			try {
				const saveChiTietPhieuNhapSach = await chiTietPhieuNhapSach.save();
				var originalQuantity = (await Sach.find({ _id: listItem[j].id }))[0].SoLuong;
				const updateItem = await Sach.updateOne(
					{ _id: mongoose.Types.ObjectId(listItem[j].id) },
					{
						$set: {
							SoLuong: originalQuantity + listItem[j].quantity,
							ModifiedBy: req.session.UserId,
							ModifiedDate: Date.now(),
						}
					}
				);
			}
			catch{
				res.json({ status: false });
			}
		}
		res.json({ status: true, MaSoPhieuNhapSach: MaSoPhieuNhapSach });
	} catch{
		res.json({ status: false });
	}
});

	
//router.post('/Delete', async (req, res) => {
//    var id = req.body.id;
//    //Kiem tra danh muc co sach hay khong
//    var sachComapare = (await Sach.find({ IdDanhMuc: id })).length; //Thieu trang thai, IsDeleted
//    if (sachComapare == 0) {
//        var danhMucCompare = (await DanhMuc.find({ _id: id })).length;
//        {
//            if (danhMucCompare == 1) {
//                try {
//                    const deleteDanhMuc = await DanhMuc.remove({ _id: id });
//                    res.json({ status: "true" });
//                } catch{
//                    res.json({ status: "error" });
//                }
//            }
//        }
//    }
//    else {
//        res.json({ status: "false" });
//    }

//});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.:'",\\^$|#\s]/g, "\\$&");
};
function Clean(text) {
	return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};
module.exports = router;
