var mongoose = require('mongoose');


var AccessControl = mongoose.Schema({
	IdRole: mongoose.Types.ObjectId,
	IdController: mongoose.Types.ObjectId
});

module.exports = mongoose.model('AccessControl', AccessControl);