enchant();
var cf1 = commonfunc.creatNew();
window.onload = function (){
	var game = new Core(320, 320);
	game.fps = 16;
	game.addLabel = function (text="Hello World!", x=0, y=0, color="rgb(255,0,0)", font="1px sans-serif") {
		var label = new Label();
		label.text = text;
		label.font = font;
		label.color = color;
		label.x = x;
		label.y = y;
		label.addEventListener(Event.ENTER_FRAME, function() {
			label.y--;
			if (label.age > 20) game.rootScene.removeChild(label);
		});
		game.rootScene.addChild(label);

	}
	game.rootScene.addEventListener(Event.ENTER_FRAME, function() {
		if (game.frame % 9 === 0) {
			var x = cf1.rand(300);
			var y = cf1.rand(300);
			var r = cf1.rand(255);
			var g = cf1.rand(255);
			var b = cf1.rand(255);
			var score = cf1.rand(50, 100);
			game.addLabel(score + " $", x, y, "rgb("+r+", "+g+", "+b+")");
		}
	});
	

	game.start();

}
