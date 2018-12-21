enchant();

window.onload = function () {
	var game = new Core(320, 320);
	game.fps = 16;

	game.preload('../images/map0.png');
	game.onload = function() {
		var bg = new Sprite(320, 320);
		var maptip = game.assets['../images/map0.png'];
		var image = new Surface(320, 320);
		for (var j = 0; j < 320; j  += 16) {
			for (var i = 0; i < 320; i += 16) {
				image.draw(maptip, 32, 0, 16, 16, i, j, 16, 16);
			}
		}
		bg.image = image;
		game.rootScene.addChild(bg);
	}

	game.start();
}