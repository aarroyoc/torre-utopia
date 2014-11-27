import utils=require("./utils");

export function elevator(mastin: any, door: any,elevator: any, state: any, factor: number, elevation: any, sfx: any){
	if(door.type !=undefined && door.type == "Elevator")
	{
		if(utils.checkCollision(mastin,door))
		{
			state.elevator=true;
			state.moveEnabled=false;
			
			var floor=elevator.position.y+(100*factor);
			if(floor> 450-1 || floor < 0-1)
			//if(floor < 0-1)
			{
				return {render: function(ms){
					return false;
				}};
			}
			sfx.elevator.play();
			return {render: function(ms){
				elevator.position.y+=0.1*factor*ms;
				mastin.position.y+=0.1*factor*ms;
				if(factor==1)
				{
					if(elevator.position.y > floor)
					{
						elevator.position.y=floor;
						mastin.position.y=floor+60;
						return false;
					}
				}else{
					if(elevator.position.y < floor)
					{
						elevator.position.y=floor;
						mastin.position.y=floor+60;
						return false;
					}
				}
				return true;
			}};
		}
	}
	return elevation;
}
