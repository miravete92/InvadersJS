$(function(){
	var DEBUG = false;
	var count = 0;
	var gameOver = false;

	function Sprite(x,y,width,height,imgSrc) {
		var self = this;
	    this.x = x;
	    this.y = y;
	    this.width = width;
	    this.height = height;
	    this.img = new Image();
		this.img.src = imgSrc;
		this.active = true;
		console.log("create sprite");
	    
	}
	Sprite.prototype.draw = function(ctx){
    	ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    	if(DEBUG){
    		ctx.beginPath();
    		ctx.rect(this.x,this.y,this.width,this.height);
    		ctx.stroke();
    	}
    };

    Sprite.prototype.update = function(inputMapping){};

    Sprite.prototype.move = function(x,y){
    	this.x = this.x + x;
    	this.y = this.y + y;
    };

    function Player(x,y){
    	this.x = x;
    	this.y = y;
    	this.width = 40;
    	this.height = 10;
    	this.img = new Image();
		this.img.src = "./square.PNG";
		this.active = true;
		console.log("create player");
    }
    Player.prototype = Object.create(Sprite.prototype);        // Set prototype to Person's
	Player.prototype.constructor = Player;

	Player.prototype.update = function(inputMapping){
		if(inputMapping['d']){
			this.move(10,0);
		}
		if(inputMapping['a']){
			this.move(-10,0);
		}
	}

	function Ball(x,y){
    	this.x = x;
    	this.y = y;
    	this.width = 10;
    	this.height = 10;
    	this.img = new Image();
		this.img.src = "./square2.PNG";
		this.speedX = 3;
		this.speedY = 3;
		this.active = true;
		console.log("create ball");
    }
    Ball.prototype = Object.create(Sprite.prototype);        // Set prototype to Person's
	Ball.prototype.constructor = Ball;

	Ball.prototype.update = function(inputMapping){
		this.move(this.speedX,this.speedY);
		if(this.x<0){
			this.x=0;
			this.speedX=-this.speedX;
		}
		if(this.x>502){
			this.x=502;
			this.speedX=-this.speedX;
		}
		if(this.y<0){
			this.y=0;
			this.speedY=-this.speedY;
		}
		/*if(this.y>758){
			gameOver = true;
		}*/
	}

	function Invader(x,y){
    	this.x = x;
    	this.y = y;
    	this.startX = x;
    	this.width = 22;
    	this.height = 16;
    	this.img = new Image();
		this.img.src = "./inv.PNG";
		this.offsetX = 0;
		this.maxX = 20;
		this.speedX = 0.2;
		this.active = true;
		console.log("create invader");
    }
    Invader.prototype = Object.create(Sprite.prototype);        // Set prototype to Person's
	Invader.prototype.constructor = Invader;

	Invader.prototype.update = function(inputMapping){
		this.move(this.speedX,0);
		if(Math.abs(this.x-this.startX)>this.maxX){
			this.speedX=-this.speedX;
		}
	}

	function renderLoop(ctx, spriteList, inputMapping){
		for(var spr in spriteList){
			if(spriteList[spr].active){
				spriteList[spr].draw(ctx);
				spriteList[spr].update(inputMapping);
			}
			
			if(spr!=0&&spriteList[spr].active&&intersectSprites(spriteList[0],spriteList[spr])){
				spriteList[0].speedY = -spriteList[0].speedY;
				if(spr>1) {
					spriteList[spr].active = false;
					count--;
				}
			}
		}
		ctx.fillStyle = "yellow";
		ctx.fillText(""+count,10,758); 

		/*if(gameOver){
			gameOver = false;
			count = 0;
			spriteList.lenght = 0;
			//spriteList = initializeObjects();
		}*/
	};

	function startRenderLoop(canvas, spriteList, inputMapping){
		var ctx = canvas.getContext("2d");
		ctx.fillStyle="black";
		ctx.strokeStyle="red";
		ctx.lineWidth="1";
		ctx.imageSmoothingEnabled = false;
		ctx.font = "30px Arial";
		setInterval(function(){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle="black";
			ctx.fillRect(0,0,canvas.width,canvas.height);
			renderLoop(ctx, spriteList, inputMapping);
		},33);
	}
	function handleInput(inputMapping){
		$("body").keydown(function(event){
			inputMapping[event.key] = true;
		});
		$("body").keyup(function(event){
			inputMapping[event.key] = false;
		});
	}
	function intersectSprites(s1, s2) {
		return !(s2.x > (s1.x + s1.width) || 
		(s2.x + s2.width) < s1.x || 
		s2.y > (s1.y + s1.height) ||
		(s2.y + s2.height) < s1.y);
	}
	function initializeObjects(){
		var spriteList = [];
		var player = new Player(256,758);
		var ball = new Ball(256,369);

		spriteList.push(ball);
		spriteList.push(player);

		for(var i = 0;i<8;i++){
			for(var j = 0;j<15;j++){
				spriteList.push(new Invader(30+(j*30),30+(i*20)));
				count++;
			}
		}
		return spriteList;
	}
	
	var spriteList = initializeObjects();

	var inputMapping = [];
	handleInput(inputMapping);

	var c = document.getElementById("myCanvas");
	c.width  = 512;
	c.height = 768; 
	startRenderLoop(c, spriteList, inputMapping);
});


