var mongoose = require('mongoose');


var Controller = mongoose.Schema({
	Location: String,
	Icon: String,
	Caption: String//Id - TrangThaiSuDung
});

module.exports = mongoose.model('Controller', Controller);