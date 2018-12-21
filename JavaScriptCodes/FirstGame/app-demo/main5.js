var STATUS_WAIT = 0;
var STATUS_WALK = 1;
var STATUS_JUMP = 2;

enchant();

window.onload = function ()
{
	var game = new Core(320, 320);
	game.fps = 16;
	var mappath = '../images/map0.png';
	var charapath = '../images/chara1.png';

	game.preload(mappath, charapath);

	game.onload = function ()
	{
		var bg = new Sprite(320, 320);
		bg.backgroundColor = "rgb(0, 200, 255)";
		var maptip = game.assets[mappath];
		var image = new Surface(320, 320);

		for (var i = 0; i < 320; i += 16) {
			image.draw(maptip, 3*16, 0, 16, 16, i, 320-16, 16, 16);
		}
		bg.image = image;

		game.rootScene.addChild(bg);

		var bear = new Sprite(32, 32);
		bear.image = game.assets[charapath];
		bear.x = 160 - 16;
		bear.y = 320 - 16 - 32;
		bear.status = STATUS_WAIT;
		bear.anim = [10, 11, 10, 12];
		bear.frame = 10;

		game.rootScene.addChild(bear);

		bear.addEventListener(Event.ENTER_FRAME, function () {
			if (bear.status == STATUS_WAIT) {
				bear.frame = bear.anim[0];
			} else if (bear.status == STATUS_WALK) {
				bear.frame = bear.anim[bear.age % 4];
			} else if (bear.status == STATUS_JUMP) {
				bear.frame = bear.anim[1];
			}

			if (bear.status != STATUS_JUMP) {
				bear.status = STATUS_WAIT;
				if (game.input.up) {
					bear.status = STATUS_JUMP;
					bear.age = 0;
				}
			}

			if (game.input.left) {
				bear.x -= 3;
				bear.scaleX = -1;
				if (bear.status != STATUS_JUMP) {
					bear.status = STATUS_WALK;
				}
			} else if (game.input.right) {
				bear.x += 3;
				bear.scaleX = 1;
				if (bear.status != STATUS_JUMP) {
					bear.status = STATUS_WALK;
				}
			}

			if (bear.status == STATUS_JUMP) {
				if (bear.age < 8) {
					bear.y -= 8;
				} else if (bear.age < 16) {
					bear.y += 8;
				} else {
					bear.status = STATUS_WAIT;
				}
			}
 
		});

		var pad = new Pad();
		pad.x = 0;
		pad.y = 220;
		game.rootScene.addChild(pad);




	}
	game.start();
}