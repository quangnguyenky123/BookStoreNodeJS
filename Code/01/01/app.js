'use strict';
var multer = require('multer');
var cors = require('cors');
var sanitize = require('mongo-sanitize');
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
require('dotenv/config');
var passport = require('passport');
var session = require('express-session');
var app = express();
var utf8 = require('utf8');
var redis = require('redis');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({ origin: "*" }));




//Controllers
//var router = express.Router(); /// Dung de hien thi dang dau tien
var login = require('./routes/admin/Login');
var datHang = require('./routes/admin/DatHang');
var thongTinCaNhan = require('./routes/admin/ThongTinCaNhan');
var phieuNhapSach = require('./routes/admin/PhieuNhapSach');
var pheDuyetSach = require('./routes/admin/PheDuyetSach');
var dangKy = require('./routes/user/DangKy');
var danhMuc = require('./routes/admin/DanhMuc');
var nhaXuatBan = require('./routes/admin/NhaXuatBan');
var lienHe = require('./routes/user/LienHe');
var quanTriVien = require('./routes/admin/QuanTriVien');
var tacGia = require('./routes/admin/TacGia');
var sach = require('./routes/admin/Sach');
var donDatHang = require('./routes/admin/DonDatHang');
var home = require('./routes/user/Home');
//var users = require('./routes/users');


//DB
mongoose.connect(process.env.DB_CONNECTION, {
	useUnifiedTopology: true,
	useNewUrlParser: true
}, () => {
	console.log('connect done!!');
});
//SessionId
app.use(session({
	secret: 'mySecretKey',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 120000 }
}));
app.use('/DatHang', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/DanhMuc', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/Sach', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/PhieuNhapSach', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/NhaXuatBan', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/TacGia', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/DonDatHang', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/ThongTinCaNhan', function (req, res, next) {
	if (req.session.UserId == undefined) {
		res.redirect('/Login');
	}
	else {
		next();
	}
});
app.use('/PheDuyetSach', function (req, res, next) {
	if (req.session.UserId == undefined && req.session.Quyen == undefined) {
		res.redirect('/Login');
	}
	else {
		if (req.session.Quyen == "Admin" || req.session.Quyen == "Employee") {
			next();
		}
		else {
			res.redirect('/Login');
		}
	}
});
app.use('/QuanTriVien', function (req, res, next) {
	if (req.session.UserId == undefined && req.session.Quyen == undefined) {
		res.redirect('/Login');
	}
	else {
		if (req.session.Quyen == "Admin") {
			next();
		}
		else {
			res.redirect('/Login');
		}
	}
});

app.use('/Login', login);
app.use('/DatHang', datHang);
app.use('/ThongTinCaNhan', thongTinCaNhan);
app.use('/LienHe', lienHe);
app.use('/PheDuyetSach', pheDuyetSach);
app.use('/DangKy', dangKy);
app.use('/PhieuNhapSach', phieuNhapSach);
app.use('/Sach', sach);
app.use('/DanhMuc', danhMuc);
app.use('/NhaXuatBan', nhaXuatBan);
app.use('/QuanTriVien', quanTriVien);
app.use('/TacGia', tacGia);
app.use('/DonDatHang', donDatHang);
app.use('/', home);

//app.use(function (req, res, next) {
//	res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
//});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
