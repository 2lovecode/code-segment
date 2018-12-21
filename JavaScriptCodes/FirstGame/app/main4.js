var DIR_LEFT = 0;
var DIR_RIGHT = 1;
var DIR_UP = 2;
var DIR_DOWN = 3;

enchant();

window.onload = function ()
{
	var game = new Core(320, 320);

	game.fps = 16;

	game.onload = function ()
	{

	};
	game.start();
}