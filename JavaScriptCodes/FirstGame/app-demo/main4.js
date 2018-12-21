var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

enchant();

window.onload = function()
{
	var game = new Core(320, 320);

	var mappath = '../images/map0.png';
	var charapath = '../images/chara0.png';

	game.fps = 16;

	game.preload(charapath, mappath);

	game.onload = function()
	{
		var bg = new Sprite(320, 320);
		var maptip = game.assets[mappath];
		var image = new Surface(320, 320);
		for (var i = 0; i < 320; i += 16){
			for (var j = 0; j < 320; j += 16){
				image.draw(maptip, 0, 0, 16, 16, i, j, 16, 16);
			}
		}

		bg.image = image;
		game.rootScene.addChild(bg);

		var person = new Sprite(32, 32);
		person.image = game.assets[charapath];
		person.x = 160 - 16;
		person.y = 160 - 16;
		person.toX = person.x;
		person.toY = person.y;

		person.anim = [
			15, 16, 17, 16, //Left
			24, 25, 26, 24, //Right
			33, 34, 35, 34, //Up
			6, 7, 8, 7]; //Down
		game.rootScene.addChild(person);
		person.addEventListener(Event.ENTER_FRAME, function () {
			if (person.y > person.toY) {
				person.dir = DIR_UP;
				if (Math.abs(person.y - person.toY) < 3) {
					person.y = person.toY;
				} else {
					person.y -= 3;
				}
			} else if (person.y < person.toY) {
				person.dir = DIR_DOWN;
				if (Math.abs(person.y - person.toY) < 3) {
					person.y = person.toY;
				} else {
					person.y += 3;
				}
			}

			if (person.x > person.toX) {
				person.dir = DIR_LEFT;
				if (Math.abs(person.x - person.toX) < 3) {
					person.x = person.toX;
				} else {
					person.x -= 3;
				}
			} else if (person.x < person.toX) {
				person.dir = DIR_RIGHT;
				if (Math.abs(person.x - person.toX) < 3) {
					person.x = person.toX;
				} else {
					person.x += 3;
				}
			}

			if (person.x == person.toX && person.y == person.toY) person.age = 1;
			person.frame = person.anim[person.dir * 4 + (person.age % 4)];
		});
		bg.addEventListener(Event.TOUCH_START, function(e){
			person.toX = e.x - 16;
			person.toY = e.y - 16;
		});
	};
	game.start();
}