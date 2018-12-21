enchant();

window.onload = function ()
{
	var game = new Core(320, 320);
	game.fps = 16;
	var path1 = './image/bg01.jpg';
	var path2 = './image/bg02.jpg';
	var path3 = './image/bg03.jpg';

	game.preload(path1, path2, path3);
	
	game.onload = function ()
	{
		var bg = makeBackground(game.assets[path1]);
		game.rootScene.addChild(bg);

		game.rootScene.addChild(makeMessage('This is root scene'));

		var select = makeSelect("[Move to scene 1]", 320 - 32*2);
		select.addEventListener(Event.TOUCH_START, function (e) {
			game.pushScene(game.makeScene1());
		});
		game.rootScene.addChild(select);
	};

	game.makeScene1 = function () {
		var scene = new Scene();
		var bg = makeBackground(game.assets[path2]);
		scene.addChild(bg);
		scene.addChild(makeMessage('This is scene 1'));

		var select = makeSelect("[Move to scene 2]", 320 - 32*2);
		select.addEventListener(Event.TOUCH_START, function (e) {
			game.pushScene(game.makeScene2());
		});
		scene.addChild(select);
		scene.addChild(makeReturn(1));
		return scene;
	};

	game.makeScene2 = function () {
		var scene = new Scene();
		var bg = makeBackground(game.assets[path3]);
		scene.addChild(bg);
		scene.addChild(makeMessage('This is scene 2'));

		scene.addChild(makeReturn(0));
		return scene;
	};

	game.start();
}

function makeBackground(image)
{
	var bg = new Sprite(320, 320);
	bg.image = image;
	return bg;
}

function makeMessage(text)
{
	var label = new Label(text);
	label.font = "16px monospace";
	label.color = "rgb(255, 255, 255)";
	label.BackgroundColor = "rgba(0, 0, 0, 0.6)";
	label.y = 320 - 32*3;
	label.width = 320;
	label.height = 32*3;
	return label;
}

function makeSelect(text, y)
{
	var label = new Label(text);
	label.font = "16px monospace";
	label.color = "rgb(255, 200, 0)";
	label.y = y;
	label.width = 320;
	return label;
}

function makeReturn(num)
{
	var game = enchant.Game.instance;
	var returnLabel = makeSelect("[Return]", 320 - 32*(2-num));
	returnLabel.addEventListener(Event.TOUCH_START, function (e) {
		game.popScene();
	});

	return returnLabel;
}