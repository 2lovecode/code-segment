var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

enchant();

window.onload = function ()
{
	var game = new Core(320, 320);
	var mappath = '../images/map0.png';
	var charapath = '../images/chara0.png';

	game.preload(mappath, charapath);

	game.onload = function()
	{
		var bg = new Sprite(320, 320);
		var maptip = game.assets[mappath];
		var image = new Surface(320, 320);

		for (var i = 0; i < 320; i += 16) {
			for (var j = 0; j < 320; j += 16) {
				image.draw(maptip, 0, 0, 16, 16, i, j, 16, 16);
			}
		}

		bg.image = image;
		game.rootScene.addChild(bg);

		var play = new Sprite(32, 32);
		play.image = game.assets[charapath];
		play.x = 160 - 16;
		play.y = 160 - 16;
		play.frame = 7;
		play.toX = play.x;
		play.toY = play.y;
		play.dir = DIR_DOWN;
		play.anim = [
		15, 16, 17, 16, //Left
		24, 25, 26, 24, //Right
		33, 34, 35, 34, //Up
		6, 7, 8, 7
		];
		game.rootScene.addChild(play);

	}

	game.start();
}