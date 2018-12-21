enchant();

window.onload = function () {
	var game = new Core(320, 320);
	game.fps = 16;
	var img = "../images/chara1.png";
	game.preload(img);

	game.onload = function () {
		var bear = new Sprite(32, 32);
		bear.image = game.assets[img];
		bear.frame = [0, 0, 1, 1, 0, 0, 2, 2];
		game.rootScene.addChild(bear);

		bear.addEventListener(Event.ENTER_FRAME, function() {
			if (this.scaleX == 1) {
				this.x  += 3;
				if (this.x >= (320 -32)) this.scaleX = -1;
			} else {
				this.x -= 3;
				if (this.x <= 0) this.scaleX = 1;
			}
		});
	}
	game.start();
}