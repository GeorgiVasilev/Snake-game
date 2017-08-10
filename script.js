	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	var cw = 15;
	var d = 'right';
	var food;
	var score;
	var snakeColor = 'green';
	var foodColor = 'red';
	var speed;
	var pause = false;
	var snakeArray;//snake array

	//initializer
	function init() {
		d = 'right';
		createSnake();
		createFood();
		score = 0;

		if (typeof gameLoop != 'undefined') {
			clearInterval(gameLoop);
		}
		gameLoop = setInterval(paint, speed);
	}
	
	//Select game speed and start the game
	function gameStart(gameSpeed) {
		speed = gameSpeed;
		$('#gameMenu').fadeOut(300);
		init();
	}

	//Create snake
	function createSnake() {
		var length = 5;
		snakeArray = [];
		for (var i = length - 1; i >= 0; i--) {
			snakeArray.push({
				x: i,
				y: 0
			});
		}
	}

	//create food
	function createFood() {
		food = {
			x: Math.round(Math.random() * (w-cw) / cw),
			y: Math.round(Math.random() * (h-cw) / cw)
		};	

		for (var i = 0; i < snakeArray.length; i++) {
	        var c = snakeArray[i];
	      
	        if (food.x == c.x && food.y == c.y) {
	        	food.x = Math.round(Math.random() * (w-cw) / cw);
	        	food.y = Math.round(Math.random() * (h-cw) / cw);
	        }
      	}	
	}

	//paint Snake
	function paint() {
		//paint the canvas
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = 'white';
		ctx.strokeRect(0, 0, w, h);

		var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;

		if (d == 'right') {
			nx++;
		}else if (d == 'left') {
			nx--;		
		}else if (d == 'up') {
			ny--;
		}else if (d == 'down') {
			ny++;
		}

		//collision code
		if (nx == -1 || nx == w / cw || ny == -1 || ny == h / cw || checkCollision(nx, ny, snakeArray)) {
			//insert final score
			$('#finalScore').html(score);
			//pause the game after death
			clearInterval(gameLoop);
			//show overlay
			$('#overlay').fadeIn(300);
			return;
		}

		if (nx == food.x && ny == food.y) {
			var tail = {
				x: nx,
				y: ny
			};
			score++;
			//create food
			createFood();
		}else {
			var tail = snakeArray.pop();
			tail.x = nx;
			tail.y = ny;
		}

		snakeArray.unshift(tail);

		for (var i = 0; i < snakeArray.length; i++) {
			var c = snakeArray[i];
			paintCell(c.x, c.y, snakeColor);
		}

		//paint cell
		paintCell(food.x, food.y, foodColor);

		//check score
		checkScore(score);

		//display current score
		$('#score').html('Your score: ' + score);
	}

	function paintCell(x, y, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x * cw, y * cw, cw, cw);
		ctx.strokeStyle = 'white';
		ctx.strokeRect(x * cw, y * cw, cw, cw);
	}

	function checkCollision(x, y, array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].x == x && array[i].y == y) {
				return true;
			}
		}
		return false;
	}

	function checkScore(score){
		if (localStorage.getItem('highScore') == null) {
			localStorage.setItem('highScore', score);
		}else {
			if (score > localStorage.getItem('highScore')) {
				localStorage.setItem('highScore', score);
			}
		}
		$('#highScore').html('High Score: ' + localStorage.highScore);
	}

	//Keybord Controller
	$(document).keydown(function(e) {
		var key = e.which;
		if (key == '37' && d != 'right' && pause == false) {
			d = 'left';
		}else if (key == '38' && d != 'down' && pause == false) {
			d = 'up';
		}else if (key == '39' && d != 'left' && pause == false) {
			d = 'right';
		}else if (key == '40' && d != 'up' && pause == false) {
			d = 'down';
		}else if (key == '32') {
			if (pause == false) {
				pause = true;
				$('#pauseDisplay').show();
				clearInterval(gameLoop);
			}else {
				pause = false;
				$('#pauseDisplay').hide();
				gameLoop = setInterval(paint, speed);
			}
		}

	});

function resetScore() {
	localStorage.highScore = 0;
	//dsipay hight score
	$('#highScore').html('High Score: 0');
}