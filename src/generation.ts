import utils=require("./utils");
var gamejs=require("gamejs");

export function generateBuilding(){
	var building=[];
	
	var sky=gamejs.image.load("img/SKY.JPG");
	sky.position=new gamejs.Rect([0,0]);
	building.push(sky);
	
	for(var j=0;j<4 /*42*/;j++){
		var floor=50+(j*100);
		var pasillo=new gamejs.graphics.Surface([600,100]);
		if(j % 2==0)
			pasillo.fill("orangered");
		else
			pasillo.fill("white");
		pasillo.position=new gamejs.Rect([20,floor]);
		building.push(pasillo);
		
		generateDoors(floor,building);
	}
	
	var elevator=new gamejs.graphics.Surface([40,480]);
	elevator.fill("blue");
	elevator.position=new gamejs.Rect([(3*125)-(125/2),0]);
	building.push(elevator);
	
	return building;
}

export function generateDoors(floor,building){
		for(var i=0;i<4;i++)
		{
			var rnd=utils.getRandomInt(1,5);
			var door=new gamejs.graphics.Surface([35,70]);
			if(rnd===1)
			{
				door=gamejs.image.load("img/PointDoor.png");
				door.type="PointDoor";
				door.points=utils.getRandomInt(1,1001);
			}else{
				door=gamejs.image.load("img/Door.png");
				door.type="BasicDoor";
				door.points=0;
			}
			door.position=new gamejs.Rect([(i+1)*125,floor+30]);
			building.push(door);
		}
}
