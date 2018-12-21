enchant();

window.onload = function ()
{
	var game = new Core(320, 320);
	var label;
	var player;
	game.fps = 16;
	game.score = 0;

	var mappath = '../images/map0.png';
	var playpath = '../images/chara1.png';
	var iconpath = '../images/icon0.png';
	game.preload(mappath, playpath, iconpath);

	game.onload = function () {
		//map
		var bg = new Sprite(320, 320);
		bg.backgroundColor = "rgb(0, 200, 255)";
		var maptip = game.assets[mappath];
		var image = new Surface(320, 320);


		for (var i = 0; i < 320; i+=16) {
			image.draw(maptip, 5*16, 0, 16, 16, i, 320-16, 16, 16);
		}

		bg.image = image;
		game.rootScene.addChild(bg);

		//player
		player = new Sprite(32, 32);
		player.image = game.assets[playpath];
		player.anim = [10, 11, 10, 12];
		player.frame = player.anim[0];
		player.x = 160 - 16;
		player.y = 320 - 32 - 16;
		game.rootScene.addChild(player);

		//pad
		var pad = new Pad();
		pad.x = 0;
		pad.y = 220;
		game.rootScene.addChild(pad);

		//score
		label = new Label();
		game.rootScene.addChild(label);

		//control the player
		player.addEventListener(Event.ENTER_FRAME, function(e) {
			if (game.input.left) {
				player.x -= 6;
				player.scaleX = -1;
			} else if (game.input.right) {
				player.x += 6;
				player.scaleX = 1;
			}
			if (!game.input.left && !game.input.right) {
				player.frame = player.anim[0];
			} else {
				player.frame = player.anim[player.age % player.anim.length];
			}
		});

		//add apple
		game.addModle = function(x, speed, frame) {
			var modle = new Sprite(16, 16);
			modle.image = game.assets[iconpath];
			modle.frame = frame;
			modle.x = x;
			modle.y = -16;
			modle.speed = speed;

			modle.addEventListener(Event.ENTER_FRAME, function () {
				modle.y += modle.speed;
				if (player.intersect(modle)) {
					if (modle.frame == 24) {
						game.end()
					} else if (modle.frame == 25) {
						game.score -= 10;
						if (game.score < 0) {
							label.text = "Time Left: "+Math.floor(game.frame/game.fps)+"<br>Score: 0";
							game.end();
						}
					} else {
						game.score += modle.frame;
					}
					game.rootScene.removeChild(modle);
				} else if (modle.y > 320 - 32) {
					game.rootScene.removeChild(modle);
				} 
			});
			game.rootScene.addChild(modle);
		};

		game.framesLeft = 100*game.fps;
		game.rootScene.addEventListener(Event.ENTER_FRAME, function (e) {
			game.framesLeft--;
			if (game.framesLeft > 0) {
				if ((game.frame % 10) ===0) {
					var x = rand(300);
					var speed = 3+rand(6);
					var type = rrand(10, 30);
					game.addModle(x, speed, type);
				}
				label.text = "Time left :"+Math.floor(game.framesLeft/game.fps)+"<br>Score :"+game.score;
			} else {
				game.end(game.score, "Your score is"+game.score);
			}
		});
	};
	game.start();
}

function rand(num)
{
	return Math.floor(Math.random()*num);
}

function rrand(n, m)
{
	return Math.floor(Math.random()*n) + m - n;
}