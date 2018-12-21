enchant();

window.onload = function()
{
	var game = new Core(320, 320);
	game.fps = 16;
	var player;
	var label;
	game.score = 0;

	var mappath = '../images/map0.png';
	var playpath = './chara1.png';
	var iconpath = './icon0.png';

	game.preload(mappath, playpath, iconpath);

	game.onload = function () {
		//map
		var bg = new Sprite(320, 320);
		bg.backgroundColor = "rgb(0, 200, 255)";
		var maptip = game.assets[mappath];
		var image = new Surface(320, 320);
		for (var i=0; i < 320; i+=16) {
			image.draw(maptip, 6*16, 0, 16, 16, i, 320-16, 16, 16);
		}
		bg.image = image;
		game.rootScene.addChild(bg);

		//play
		player = new Sprite(32, 32);
		player.image = game.assets[playpath];
		player.anim = [10, 11, 10, 12];
		player.frame = player.anim[0];
		player.x = 160 - 16;
		player.y = 320 - 32 -16;
		game.rootScene.addChild(player);

		//pad
		var pad = new Pad();
		pad.x = 0;
		pad.y = 220;
		game.rootScene.addChild(pad);

		//play control
		player.addEventListener(Event.ENTER_FRAME, function(e) {
			if (game.input.left) {
				player.x -= 6;
				player.scaleX = -1;
			} else if (game.input.right) {
				player.x += 6;
				player.scaleX = 1;
			}

			if(!game.input.left && !game.input.right) {
				player.frame = player.anim[0];
			} else {
				player.frame = player.anim[player.age % player.anim.length];
			}
		});

		//score
		label = new Label("");
		game.rootScene.addChild(label);

		//add modle
		game.addModle = function (x, speed, type) {
			var modle = new Sprite(16, 16);
			modle.image = game.assets[iconpath];
			modle.frame = type;
			modle.x = x;
			modle.speed = speed;
			modle.y = -16;
			game.rootScene.addChild(modle);
			modle.addEventListener(Event.ENTER_FRAME, function (e) {
				modle.y += speed;
				if (player.within(modle, 16)) {
					if (modle.frame == 24) {
						game.end();
					} else if (modle.frame == 25) {
						game.score -= 10;
					} else {
						game.score += modle.frame;
					}
					if (game.score < 0) {
						label.text = "Time Left: "+Math.floor(game.framesLeft/game.fps)+"<br>Score: 0";
						game.end();
					}
					game.rootScene.removeChild(modle);
				}else if (modle.y > (320-16)) {
					game.rootScene.removeChild(modle);
				}
			});
		};

		game.framesLeft = 100 * game.fps;
		game.rootScene.addEventListener(Event.ENTER_FRAME, function(e) {
			game.framesLeft--;
			if (game.framesLeft > 0) {
				if ((game.frame % 5) === 0 ) {
					var x = rand(300);
					var speed = 3 + rand(6);
					var type = rrand(10, 30);
					game.addModle(x, speed, type);
				}
				label.text = "Time Left: "+Math.floor(game.framesLeft/game.fps)+"<br>Score: "+game.score;
			} else {
				game.end(game.score, "Your score is:"+game.score);
			}
		});
	};


	game.start();
}

function rand(num)
{
	return Math.floor(Math.random() * num);
}

function rrand(n, m)
{
	return Math.floor(Math.random() * n) + m - n;
}