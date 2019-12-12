'use strict';
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Sach = require('../../models/Sach');
var DanhMuc = require('../../models/DanhMuc');
var TrangThaiSuDung = require('../../models/TrangThaiSuDung');
var QuanTriVien = require('../../models/QuanTriVien');
var AccessControl = require('../../models/AccessControl');
/* GET users listing. */
router.get('/', function (req, res) {
	//console.log(req.session.UserId);
	//var trangThaiSuDung = await TrangThaiSuDung.find({});
	res.render('LienHe/LienHe.html');
});
module.exports = router;
