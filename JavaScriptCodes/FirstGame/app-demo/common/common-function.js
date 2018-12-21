//
var commonfunc = {
	creatNew : function () {
		var cf = {};
		cf.rand = function (start, end = 0) {
			if (!end) {
				return Math.floor(Math.random() * start);
			}
			return Math.floor(Math.random() * (end-start)) + start;
		};
		return cf;
	},
};