enchant();

window.onload = function () {
	var game = new Core(320, 320);
	var img1 = "../images/chara1.png";
	game.preload(img1);
	game.onload = function () {
		var bear = new Sprite(32, 32);
		bear.image = game.assets[img1];
		bear.x = 10;
		bear.y = 10;
		game.rootScene.addChild(bear);

		bear.frame = [0, 0, 1, 1, 0, 0, 2, 2];
		
		bear.addEventListener(Event.ENTER_FRAME, function () {
			if (bear.scaleX == 1) {
				bear.x += 3;
				if (bear.x >= (320-32)) {
					bear.scaleX = -1;
				}
			} else {
				bear.x -= 3;
				if (bear.x <= 0) {
					bear.scaleX = 1;
				}
			}
		});
	};

	game.start();
}