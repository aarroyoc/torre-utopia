///<reference path="typings/node/node.d.ts"/>
/* MAJOR TODOs
 * Dynamic display - DONE
 * Jumps - DONE 
 * Game Over screen [image, score, restart] - DONE
 * Intro - DONE
 * SFX - DONE
 * HUD - DONE
 * For 2.0 - Multiplayer...
 * Adjust Difficult
 * Change sprites (offices)
 * Animations
 * Touch Input - DONE
 * List of Social promotion (Google+, Google+ Pages, Google+ Comu, WhatsApp, LINE, Telegram, Divel Newsletter)
 * Post-Mortem (Blog)
 * Publish is a feature
 */
import utils=require("./src/utils");
import generation=require("./src/generation");
import machines=require("./src/machines");

var gamejs=require("gamejs");
var font=require("gamejs/src/gamejs/font.js");
var graphics=require("gamejs/src/gamejs/graphics.js");

console.log("Torre Utopía started");

var state={
	started: false,
	intro: true,
	moveEnabled: true,
	gameOver: false,
	elevator: false,
	jumpingUp: false,
	jumpingDown: false,
	jumpFloor: 0,
	waiting: false
};

var sfx={
	door: new Audio("img/door-01.ogg"),
	elevator: new Audio("img/elevator.ogg")
};
var music=new Audio("img/RagtimeDance.ogg");
music.addEventListener("ended",function(){
	music.currentTime=0;
	music.play();
});
music.play();

var score=0;

var remaining=0;

gamejs.preload(["img/SKY.JPG","img/Elevator.png","img/Door.png","img/PointDoor.png","img/Mastin.png","img/Malo.png","img/TorreUtopia.png"]);

gamejs.ready(function(){
	window.addEventListener("contextmenu",function(e){
		e.stopPropagation();
		e.preventDefault();
	});
	gamejs.display.setCaption("Torre Utopia");
	var display=gamejs.display.setMode([640,480]);
	
	//var sky=new gamejs.graphics.Surface([640,480]);
	//sky.fill("cyan");
	/* Generating world */
	var building: any=generation.generateBuilding();
	var people=[];
	var bullets=[];
	var elevation={render: function(ms){
		return false;
	}};
	
	remaining=building.filter(function(val){
		return (val.type=="PointDoor");
	}).length;
	
	var hud=new gamejs.graphics.Surface([600,50]);
	hud.fill("white");
	hud.renderScore=function(score){
		hud.clear(hud.getRect());
		var font=new gamejs.font.Font("30px P2P");
		hud.blit(font.render(score));
	};
	
	var mastin=new gamejs.graphics.Surface([25,40]);
	mastin.fill("green");
	mastin=gamejs.image.load("img/Mastin.png");
	mastin.position=new gamejs.Rect([50,250-40]);
	mastin.move={};
	
	var elevator=gamejs.image.load("img/Elevator.png");
	elevator.type="Elevator";
	elevator.position=new gamejs.Rect([(3*125)-(125/2),250-100]);
	building.push(elevator);
	
	gamejs.event.onEvent(function(event){
		if(event.type===gamejs.event.KEY_DOWN)
		{	
			if(event.key===gamejs.event.K_LEFT)
				mastin.move.left=true;
			if(event.key===gamejs.event.K_RIGHT)
				mastin.move.right=true;
			if(event.key===gamejs.event.K_UP)
				mastin.move.up=true;
			if(event.key===gamejs.event.K_DOWN)
				mastin.move.down=true;
			if(event.key===gamejs.event.K_SPACE)
				mastin.move.jump=true;
			mastin.move.animation=true;
			
			if(!state.started)
				state.started=true;
			if(state.gameOver && !state.waiting)
				window.location.reload();
		}
		if(event.type===gamejs.event.KEY_UP)
		{
			if(event.key===gamejs.event.K_LEFT)
				mastin.move.left=false;
			if(event.key===gamejs.event.K_RIGHT)
				mastin.move.right=false;
			if(event.key===gamejs.event.K_UP)
				mastin.move.up=false;
			if(event.key===gamejs.event.K_DOWN)
				mastin.move.down=false;
			if(event.key===gamejs.event.K_SPACE)
				mastin.move.jump=false;
			mastin.move.animation=false;
		}
		if(event.type===gamejs.event.TOUCH_DOWN)
		{
			var x=event.touches[0].pos[0];
			var y=event.touches[0].pos[1];
			
			if(x<window.innerWidth/2)
				mastin.move.left=true;
			if(x>window.innerWidth/2)
				mastin.move.right=true;
			if(y<window.innerHeight/4)
				mastin.move.up=true;
			if(y>(window.innerHeight*3/4))
				mastin.move.down=true;
			
			if(!state.started)
				state.started=true;
			if(state.gameOver && !state.waiting)
				window.location.reload();
		}
		if(event.type===gamejs.event.TOUCH_UP)
		{
			var x=event.touches[0].pos[0];
			var y=event.touches[0].pos[1];
		
			mastin.move.left=false;
			mastin.move.right=false;
			mastin.move.up=false;
			mastin.move.down=false;
		}
	});
	
	gamejs.onTick(function(ms){
		display.clear();
		if(state.started)
		{
			//LOGIC
			if(remaining==0)
			{
				building=building.filter(function(val){
					return (val.type!="BasicDoor" && val.type!="PointDoor" && val.type!="OldPointDoor" && val.type!="PointsText");
				});
				//REGENERATE DOORS
				for(var j=0;j<4;j++)
				{
					var floor=50+(j*100);
					generation.generateDoors(floor,building);
				}
				remaining=building.filter(function(val){
					return (val.type=="PointDoor");
				}).length;
				//PUT LEVEL UP
				
				//DELETE MALOS
				
				//INCREMENT MALOS DIFFICULT
			}
			
			if(mastin.move.up && state.moveEnabled)
			{
				//CHECK INTERACTIVE ELEMENTS
				for(var index=0;index<building.length;index++){
					var door=building[index];
					if(door.type != undefined && door.type == "PointDoor")
					{
						if(utils.checkCollision(mastin,door))
						{
							sfx.door.play();
							remaining--;
							door.fill("cyan");
							door.type = "OldPointDoor";
							score+=door.points;
							hud.renderScore(score);
							building=building.filter(function(value,idx,array){
								return (idx!=index);
							});
							building.push(door);
							var points=utils.textToSurface(door.points+"");
							points.type="PointsText";
							points.position=new gamejs.Rect([door.position.x,door.position.y]);
							building.push(points);
						}
					}
					elevation=machines.elevator(mastin,door,elevator,state,-1,elevation,sfx);
				}
			}
			if(mastin.move.down && state.moveEnabled)
			{
				for(var index=0;index<building.length;index++){
					var door=building[index];
					elevation=machines.elevator(mastin,door,elevator,state,1,elevation,sfx);
				}
			}
			//GENERATE 'MALOS'
			if(utils.getRandomInt(1,501)==1)
			{
				var doors=building.filter(function(value){
					return (value.type=="PointDoor" || value.type=="BasicDoor");
				});
				var index=utils.getRandomInt(0,doors.length);
				var malo=new gamejs.graphics.Surface([25,40]);
				malo.fill("yellow");
				malo=gamejs.image.load("img/Malo.png");
				malo.position=new gamejs.Rect([doors[index].position.x,doors[index].position.y+30]);
				malo.time=0;
				people.push(malo);
			}
			people.forEach(function(malo){
				malo.time++;
				var sentido;
				if(mastin.position.x < malo.position.x){
					if(!utils.checkCollision(mastin,malo))
					{
						var maloCollision=false;
						people.forEach(function(segundoMalo){
							if(utils.checkCollision(malo,segundoMalo))
								maloCollision=true;
						});
						if(!maloCollision)
							malo.position.moveIp(-0.2*ms,0);
					}
					sentido=-1;
				}
				if(mastin.position.x > malo.position.x){
					if(!utils.checkCollision(mastin,malo))
					{
						var maloCollision=false;
						people.forEach(function(segundoMalo){
							if(utils.checkCollision(malo,segundoMalo))
								maloCollision=true;
						});
						if(!maloCollision)
							malo.position.moveIp(0.2*ms,0);
					}
					sentido=1;
				}
				if(malo.time>250){
					malo.time=0;
					var bullet=new gamejs.graphics.Surface([10,10]);
					bullet.fill("black");
					bullet.position=new gamejs.Rect([malo.position.x,malo.position.y-5]);
					bullet.sentido=sentido;
					bullets.push(bullet);
				}
			});
			//PHYSICS
				//PLAYER PHYSICS
				if(state.moveEnabled)
				{
					if(mastin.move.left)
						mastin.position=mastin.position.move(-0.25*ms,0);
					if(mastin.move.right)
						mastin.position=mastin.position.move(0.25*ms,0);
					if(mastin.move.jump && !state.jumpingUp && !state.jumpingDown)
					{
						state.jumpingUp=true;
						state.jumpingDown=false;
						state.jumpFloor=mastin.position.y;
					}
				}
				if(state.jumpingUp && !state.jumpingDown)
				{
					mastin.position=mastin.position.move(0,-0.3*ms);
					if(mastin.position.y<state.jumpFloor-30)
					{
						state.jumpingUp=false;
						state.jumpingDown=true;
					}
				}
				if(state.jumpingDown && !state.jumpingUp)
				{
					mastin.position=mastin.position.move(0,0.3*ms);
					if(mastin.position.y>state.jumpFloor)
					{
						mastin.position.y=state.jumpFloor;
						state.jumpingDown=false;
					}
				}
				
				if(mastin.position.x < 20)
					mastin.position.x=20;
				if(mastin.position.x > (620-25))
					mastin.position.x=(620-25);
				//BULLETS
				bullets.forEach(function(bullet){
					bullet.position.moveIp(0.30*ms*bullet.sentido,0);
					if(utils.checkCollision(mastin,bullet)){
						//GAME OVER
						console.log("Game Over");
						state.moveEnabled=false;
						state.gameOver=true;
						state.waiting=true;
						setTimeout(function(){
							state.waiting=false;
						},1000);
					}
				});
				//ELEVATOR
				if(state.elevator)
				{
					state.elevator=elevation.render(ms);
					if(state.elevator==false)
						state.moveEnabled=true;
				}
			//AUDIO
		}
		//RENDER
		if(state.gameOver)
		{
			var gameOver=new gamejs.graphics.Surface([640,480]);
			gameOver.fill("white");
			var font=new gamejs.font.Font("60px P2P");
			var small=new gamejs.font.Font("15px P2P");
			var message=font.render("Game Over");
			gameOver.blit(message);
			var scoreRender=font.render(score);
			gameOver.blit(scoreRender,new gamejs.Rect([120,120]));
			var restart=small.render("Press any key to restart");
			gameOver.blit(restart,new gamejs.Rect([50,350]));
			display.blit(gameOver);
		}
		else if(!state.started)
		{
			var intro=gamejs.image.load("img/TorreUtopia.png");
			display.blit(intro);
		}
		else{
			building.forEach(function(sprite){
				display.blit(sprite,sprite.position);
			});
			people.forEach(function(sprite){
				display.blit(sprite,sprite.position);
			});
			bullets.forEach(function(sprite){
				display.blit(sprite,sprite.position);
			});
			display.blit(hud);
			display.blit(mastin,mastin.position);
		}
	});
});
