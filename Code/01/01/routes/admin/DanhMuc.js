'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sach = require('../../models/Sach');
var Quyen = require('../../models/Quyen');
var DanhMuc = require('../../models/DanhMuc');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var QuanTriVien = require('../../models/QuanTriVien');
var AccessControl = require('../../models/AccessControl');
/* GET users listing. */
router.get('/', function (req, res) {
	//console.log(req.session.UserId);
	//var trangThaiSuDung = await TrangThaiSuDung.find({});
	res.render('QuanLyDanhMuc/QuanLyDanhMuc.html');
});
router.post('/LoadAccessControl', async (req, res) => {
	var quanTriVien = await QuanTriVien.find({ _id: req.session.UserId });
	var accessControl = await AccessControl.aggregate([
		{ $match: { IdRole: quanTriVien[0].IdQuyen } },
		{
			$lookup:
			{
				from: "controllers",
				localField: "IdController",
				foreignField: "_id",
				as: "Controller"
			}
		}
	]);
	res.json({ accessControl: accessControl, name: quanTriVien[0].TenQuanTriVien })
});
router.post('/LoadData', async (req, res) => {
	var searchString = req.body.searchString;
	var page = req.body.page;
	var pageSize = req.body.pageSize;
    var totalRow;
    var danhMuc;
	var trangThaiSuDung = await TrangThaiSuDung.find({});
	var AccessControlAdmin = false;
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		AccessControlAdmin = true;
	}
	if (req.session.Quyen == 'User') {
		AccessControlAdmin = false;
	}
    if (searchString != "") {
        const regex = new RegExp(escapeRegex(searchString), 'gi');
        totalRow = (await DanhMuc.find({ TenDanhMuc: regex })).length;
        if (totalRow > 0) {
			danhMuc = await DanhMuc.aggregate([
				{ $match: { TenDanhMuc: regex } },
				{
					$lookup:
					{
						from: "trangthaisudungs",
						localField: "IdTrangThai",
						foreignField: "_id",
						as: "TenTrangThai"
					}
				}
            ]).sort({ TenDanhMuc: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
        }
    }
    else {
        totalRow = (await DanhMuc.find({})).length;//ko search
        if (totalRow > 0) {
            danhMuc = await DanhMuc.aggregate([
                {
                    $lookup:
                    {
                        from: "trangthaisudungs",
                        localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
                        foreignField: "_id",
                        as: "TenTrangThai"
                    }
                }]).sort({ TenDanhMuc: 1 }).skip((page - 1) * pageSize).limit(pageSize);//lay du lieu ung voi so trang
        }
	}

	res.json({ status: "true", data: danhMuc, categoryStatus: trangThaiSuDung, totalRow: totalRow, AccessControlAdmin: AccessControlAdmin});
});

router.post('/LoadDetail', async (req, res) => {
	var ID = mongoose.Types.ObjectId(req.body.id);
	var danhMuc;
	var trangThaiSuDung = await TrangThaiSuDung.find({});
	danhMuc = await DanhMuc.aggregate([
		{ $match: { _id: ID } },
		{$lookup:
			{
				from: "trangthaisudungs",
				localField: "IdTrangThai",//Ban dau ko co truong IdTrangThai trong db => error
				foreignField: "_id",
				as: "TenTrangThai"
			}
		}
	]);//lay du lieu ung voi so trang
    res.json({ status: "true", data: danhMuc, categoryStatus: trangThaiSuDung });
});
router.post('/Update', async (req, res) => {
	//TH1: TenDanhMuc khong thay doi
	var first = await DanhMuc.find({ _id: req.body.modelUpdate[0]._id });
	if (first[0].TenDanhMuc == req.body.modelUpdate[0].TenDanhMuc) {
		try {
			const updateItem = await DanhMuc.updateOne(
				{ _id: req.body.modelUpdate[0]._id },
				{
					$set: {
						TenDanhMuc: req.body.modelUpdate[0].TenDanhMuc,
						MoTa: req.body.modelUpdate[0].MoTa,
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
	//TH2: TenDanhMuc thay doi
	else {
		var compare = (await DanhMuc.find({ TenDanhMuc: req.body.modelUpdate[0].TenDanhMuc })).length;
		if (compare == 0) {
			try {
				const updateItem = await DanhMuc.updateOne(
					{ _id: req.body.modelUpdate[0]._id },
					{
						$set: {
							TenDanhMuc: req.body.modelUpdate[0].TenDanhMuc,
							MoTa: req.body.modelUpdate[0].MoTa,
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
		else
			res.json({ status: "false" });
	}
});
router.post('/Create', async (req, res) => {
	var TenDanhMuc = req.body.modelCreate[0].TenDanhMuc;
    var MoTa = req.body.modelCreate[0].MoTa;
	var IdTrangThai = req.body.modelCreate[0].IdTrangThai;
	if (req.session.Quyen == 'Admin' || req.session.Quyen == 'Employee') {
		var danhMuc = new DanhMuc({
			TenDanhMuc: TenDanhMuc,
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
		var danhMuc = new DanhMuc({
			TenDanhMuc: TenDanhMuc,
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
	var danhMucCompare = (await DanhMuc.find({ TenDanhMuc: TenDanhMuc })).length;
	if (danhMucCompare == 0) {
		try {
			const saveDanhMuc = await danhMuc.save();
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
    //Kiem tra danh muc co sach hay khong
    var sachComapare = (await Sach.find({ IdDanhMuc: id })).length; //Thieu trang thai, IsDeleted
    if (sachComapare == 0) {
        var danhMucCompare = (await DanhMuc.find({ _id: id })).length;
        {
            if (danhMucCompare == 1) {
                try {
                    const deleteDanhMuc = await DanhMuc.remove({ _id: id });
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
    return text.replace(/[-[\]{}()*+?.:'",\\^$|#\s]/g, "\\$&");
};
function Clean(text) {
	return text.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
};


module.exports = router;
