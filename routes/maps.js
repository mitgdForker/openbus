var 
	Navigation = require('../modules/navi').navi
	,config = require('../config')
;


exports.index = function(req, res)
{
	var navigation = Navigation(req.route);

	res.render('index', {bodyClass: 'map',title: 'Openbus - Abfahrtsmonitor', navigation:navigation, config:config});
};