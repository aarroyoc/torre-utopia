var gamejs=require("gamejs");

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function textToSurface(text: string){
	var font=new gamejs.font.Font("9px P2P","cyan");
	return font.render(text,"yellow");
}

export function checkCollision(mastin: any, door: any){
	if(mastin.position.x > door.position.x)
		if(mastin.position.x < door.position.x + door.getRect().width)
			if(mastin.position.y > door.position.y)
				if(mastin.position.y < door.position.y + door.getRect().height)
					return true;
	return false;
}

export enum CONSTANT{
	SCREEN_HEIGHT=640
};
