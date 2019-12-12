'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Quyen = require('../../models/Quyen');
var QuanTriVien = require('../../models/QuanTriVien');
var DanhMuc = require('../../models/DanhMuc');
var Sach = require('../../models/Sach');
var DonDatHang = require('../../models/DonDatHang');
var ChiTietDonDatHang = require('../../models/ChiTietDonDatHang');
/* GET users listing. */
router.get('/', async (req, res) => {
	res.render('Home/Home.html');
});
router.post('/LoadData', async (req, res) => {
	if (req.session.UserId == null || req.session.UserId == "" || req.session.UserId == undefined) {
		var loginOrLogouts = "Đăng nhập";
	}
	else {
		var loginOrLogouts = "Đăng xuất";
		var HomeControls = [{ href: "/Sach", control: "Quản trị", icon: "fas fa-marker" }];
		var username = await QuanTriVien.find({ _id: req.session.UserId });
	}
	var danhMuc = await DanhMuc.find({ IdTrangThai: '5dd6c4d03d9bfe5770f9911e' });
	res.json({ danhMuc: danhMuc, loginOrLogouts: loginOrLogouts, HomeControls: HomeControls, helloUsers: username });
});
//Sách m?i
router.post('/LoadDataNewBook', async (req, res) => {
	var pageSize = req.body.pageSize;
	var page = req.body.page;
	var dateCompareNewBook = new Date();
	dateCompareNewBook.setDate(dateCompareNewBook.getDate() - 30);
	var sachMoi = await Sach.find({
		ModifiedDate: { $gte: dateCompareNewBook },
		IdTrangThai: '5dd6b85137c51429589b43f1',
		IdTrangThaiChapNhan:'5de901f91c9d4400003a88d0'
	}).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);
	var totalRow = (await Sach.find({
		ModifiedDate: { $gte: dateCompareNewBook },
		IdTrangThai: '5dd6b85137c51429589b43f1',
		IdTrangThaiChapNhan: '5de901f91c9d4400003a88d0'
	})).length;
	res.json({ sachMoi: sachMoi, totalRow: totalRow });
});
//Sách bán ch?y
router.post('/LoadDataHotBook', async (req, res) => {
	var pageSize = req.body.pageSize;
	var page = req.body.page;
	var dateCompareNewBook = new Date();
	dateCompareNewBook.setDate(dateCompareNewBook.getDate() - 30);
	var sachBanChay = await Sach.find({
		IdTrangThai: '5dd6b85137c51429589b43f1',
		IdTrangThaiChapNhan: '5de901f91c9d4400003a88d0'
	}).sort({ SoLuotMua: 1 }).skip((page - 1) * pageSize).limit(pageSize);
	var totalRow = (await Sach.find({
		IdTrangThai: '5dd6b85137c51429589b43f1',
		IdTrangThaiChapNhan: '5de901f91c9d4400003a88d0'
	})).length;
	if (totalRow >= 10) {
		totalRow = 10;
	}
	res.json({ sachBanChay: sachBanChay, totalRow: totalRow });
});
//Sách s?p bán
router.post('/LoadDataSellingSoonBook', async (req, res) => {
	var pageSize = req.body.pageSize;
	var page = req.body.page;
	var dateCompareNewBook = new Date();
	dateCompareNewBook.setDate(dateCompareNewBook.getDate() - 30);
	var sachSapBan = await Sach.find({
		IdTrangThai: '5dd6b8e91c9d440000993966',
		IdTrangThaiChapNhan: '5de901f91c9d4400003a88d0'
	}).sort({ SoLuotMua: 1 }).skip((page - 1) * pageSize).limit(pageSize);
	var totalRow = (await Sach.find({
		IdTrangThai: '5dd6b8e91c9d440000993966',
		IdTrangThaiChapNhan: '5de901f91c9d4400003a88d0'
	})).length;
	res.json({ sachSapBan: sachSapBan, totalRow: totalRow });
});
//Sem chi ti?t sách
router.post('/ProductView', async (req, res) => {
	var id = mongoose.Types.ObjectId(req.body.id);
	var productView = await Sach.aggregate([
		{ $match: { _id: id } },
		{
			$lookup:
			{
				from: "tacgias",
				localField: "IdTacGia",
				foreignField: "_id",
				as: "TenTacGia"
			}
		}
	]);
	var isSale = productView[0].IdTrangThai;
	if (isSale == '5dd6b85137c51429589b43f1')
		res.json({ productView: productView, isSale: true });
	else
		res.json({ productView: productView, isSale: false });
});
//Tai sach theo ten danh muc
router.post('/LoadBookByCategory', async (req, res) => {
	var pageSize = req.body.pageSize;
	var page = req.body.page;
	var id = mongoose.Types.ObjectId(req.body.id);
	var bookByCategory = await Sach.find({
		IdDanhMuc: id,
		IdTrangThai: '5dd6b85137c51429589b43f1',
		IdTrangThaiChapNhan: '5de901f91c9d4400003a88d0'
	}).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);
	var totalRow = (await Sach.find({
		IdDanhMuc: id,
		IdTrangThai: '5dd6b85137c51429589b43f1',
		IdTrangThaiChapNhan: '5de901f91c9d4400003a88d0'
	})).length;
	var categoryNameSelected = await DanhMuc.find({ _id: id });
	res.json({ bookByCategory: bookByCategory, totalRow: totalRow, categoryNameSelected: categoryNameSelected[0].TenDanhMuc });

});
router.post('/LoadAllBook', async (req, res) => {
	var searchString = req.body.searchString;
	var pageSize = req.body.pageSize;
	var page = req.body.page;
	if (searchString != "") {
		const regex = new RegExp(escapeRegex(searchString), 'gi');
		var bookByCategory = await Sach.aggregate([
			{ $match: { TenSach: regex, IdTrangThai: mongoose.Types.ObjectId('5dd6b85137c51429589b43f1'), IdTrangThaiChapNhan: mongoose.Types.ObjectId('5de901f91c9d4400003a88d0') } }
		]).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);
		var totalRow = (await Sach.aggregate([
			{ $match: { TenSach: regex, IdTrangThai: mongoose.Types.ObjectId('5dd6b85137c51429589b43f1'), IdTrangThaiChapNhan: mongoose.Types.ObjectId('5de901f91c9d4400003a88d0') } }
		])).length;
		res.json({ bookByCategory: bookByCategory, totalRow: totalRow });
	}
	else {
		var bookByCategory = await Sach.find({
			IdTrangThai: '5dd6b85137c51429589b43f1',
			IdTrangThaiChapNhan: mongoose.Types.ObjectId('5de901f91c9d4400003a88d0')
		}).sort({ TenSach: 1 }).skip((page - 1) * pageSize).limit(pageSize);
		var totalRow = (await Sach.find({
			IdTrangThai: '5dd6b85137c51429589b43f1',
			IdTrangThaiChapNhan: mongoose.Types.ObjectId('5de901f91c9d4400003a88d0')
		})).length;
		res.json({ bookByCategory: bookByCategory, totalRow: totalRow });
	}
});
router.post('/OrderHang', async (req, res) => {
	if (req.session.UserId == null || req.session.UserId == "" || req.session.UserId == undefined)
		res.json({ status: "error" });
	else {
		var listItem = req.body.listItem;
		var listSach = [];
		var a;
		for (a = 0; a < listItem.length; a++) {
			var sach = await Sach.find({ _id: mongoose.Types.ObjectId(listItem[a].id) });
			var Gia = Number(listItem[a].quantity) * sach[0].Gia;
			listSach.push({ Id: listItem[a].id, Quantity: listItem[a].quantity, DonGia: Gia, IdNguoiBan: String(sach[0].CreatedBy) });//Câ?p nhâ?t la?i danh sa?ch ha?ng ????c ???t
		}
		var listItemHandled = [];
		var i, j, k;
		for (i = 0; i < listSach.length; i++) {
			var flag = 0;
			var IdNguoiBan = listSach[i].IdNguoiBan;
			//Kiem tra Id cu?a ng??i ban da xu li chua
			for (k = 0; k < listItemHandled.length; k++) {
				if (IdNguoiBan == listItemHandled[k].id) {
					flag = 1;
				}
			}
			if (flag == 1) {
				continue;
			}
			listItemHandled.push({ id: IdNguoiBan });///Danh dau Id da d??c xu ly
			var TongTien = 0;/// Tong tien moi don hang
			for (j = 0; j < listSach.length; j++) {
				if (listSach[j].IdNguoiBan == IdNguoiBan) {
					TongTien = TongTien + Number(listSach[j].DonGia);
				}
			}
			var totalDonDatHang = (await DonDatHang.find({})).length;///Tao MaSoDonDatHang
			var MaSoDonDatHang = "DDH01-100000" + String(1 + totalDonDatHang);
			var NguoiBan = await QuanTriVien.find({ _id: mongoose.Types.ObjectId(IdNguoiBan) });
			var QuyenNguoiBan = (await Quyen.find({ _id: NguoiBan[0].IdQuyen }))[0].TenQuyen;
			///Nguoi mua
			if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
				var IsBookStoreBuy = true;
			}
			if (req.session.Quyen == 'User') {
				var IsBookStoreBuy = false;
			}
			//Nguoi ban
			if (QuyenNguoiBan == 'Admin' || QuyenNguoiBan == 'Employee') {
				var IsBookStoreSale = true;
			}
			if (QuyenNguoiBan == 'User') {
				var IsBookStoreSale = false;
			}
		
			var donDatHang = new DonDatHang({
				MaSoDonDatHang: "DDH01-100000" + String(1 + totalDonDatHang),
				IdKhachHang: req.session.UserId,
				IdNguoiBan: IdNguoiBan,
				NgayDat: Date.now(),
				TongTien: TongTien,
				IdTrangThaiGiaoHang: mongoose.Types.ObjectId('5de39d6e1c9d4400004a43d6'),
				XacNhan: true,
				IsDeleted: false,
				IsBookStoreBuy: IsBookStoreBuy,
				IsBookStoreSale: IsBookStoreSale,
				ModifiedBy: req.session.UserId,
				ModifiedDate: Date.now(),
				CreatedBy: req.session.UserIdd,
				CreatedDate: Date.now()
			});
			try {
				const saveDonDatHang = await donDatHang.save();
				var SearchDonDatHang = await DonDatHang.find({ MaSoDonDatHang: MaSoDonDatHang });
				var IdDonDatHang = SearchDonDatHang[0]._id;
				var b;
				for (b = 0; b < listSach.length; b++) {
					if (listSach[b].IdNguoiBan == IdNguoiBan) {
						var chiTietDonDatHang = new ChiTietDonDatHang({
							IdDonDatHang: IdDonDatHang,//Id - DonDatHang
							IdSach: mongoose.Types.ObjectId(listSach[b].Id),//Id - Sach
							SoLuong: listSach[b].Quantity,
							DonGia: listSach[b].DonGia//Tong so tien
						});
						try {
							const saveChiTietDonDatHang = await chiTietDonDatHang.save();
						}
						catch{
							res.json({ status: false });
						}
					}
				}
				//res.json({ status: true });
			} catch{
				res.json({ status: false });
			}
		}
		res.json({ status: true });
	}
});
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.:'",\\^$|#\s]/g, "\\$&");
};

module.exports = router;