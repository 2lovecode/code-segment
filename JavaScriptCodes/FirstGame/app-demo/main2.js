enchant();

window.onload = function(){
	var game = new Core(320, 320);
	game.fps = 16;
	game.preload('../images/map0.png');
	game.onload = function () {
		var play = new Sprite(320, 320);
		var maplip = game.assets['../images/map0.png'];
		var image = new Surface(320, 320);
	}

	game.start();
}