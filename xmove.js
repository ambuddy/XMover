/**
 *	XMover v.1.8 (c) ambuddy
 *
 *	XMover is a tool helping you to interactively position any visual object on screen
 *	and view how its co0rdinates change in browser console.
 *
 *	Just add some objects to xmover in any part of code as follows:
 *	xmove(anyDisplayObject);
 *	xmove(myTextField, myPIXIContainer ... mySprite);
 *	xmove([myObj1, myObj2 ... myObjN]);
 *	You may add as many objects as you want as many times as desired passing one object,
 *	or a bunch of comma separated objects or an array of objects.
 *	
 *	Note that xmove() global function is a shorthand for method xmover.add().
 *
 *	Then you can move added objects one by one on the scene using arrow keys. Also you
 *	can rotate them using <> keys, hide and reveal using sqr bracket ([]) keys and scale
 *	objects with 0 and 9 keys.
 *	Switching between objects performed by -+ keys. Once you switched to next object
 *	it jumps and blinks once.
 *
 *	As object's position and rotation changes these values are traced in console.
 *
 *	Don't forget to mouse click on the scene to give XMover ability to catch key press events.
 */


const HOTKEYS	= {
	LEFT				: 37,			// ← move
	RIGHT				: 39,			// → move
	UP					: 38,			// ↑ move
	DOWN				: 40,			// ↓ move
	DECREASE_ALPHA		: 219,			// [ decrease alpha (hide)
	INCREASE_ALPHA		: 221,			// ] increase alpha (show)
	DECREASE_SCALE		: 57,			// 9 decrease scale
	INCREASE_SCALE		: 48,			// 0 increase scale
	PREV				: 189,			// - previous object
	NEXT				: 187,			// + next object
	ROTATE_LEFT			: 188,			// <
	ROTATE_RIGHT		: 190			// >
	//SHIFT				: 16			// Shift fast move
};

class XMover
{
	posStep		= 1;			// How fast object moves.
	posStepFast	= 10;			// How fast object moves while Shift key is pressed.
	posStepSlow	= 0.1;			// How fast object moves while Alt key is pressed.
	rotStep		= 0.01;			// How fast object rotates.
	rotStepFast	= 0.1;          // How fast object rotates and scales while Shift key is pressed.
	rotStepSlow	= 0.001;        // How fast object rotates and scales while Alt key is pressed.
	alphaStep		= 1;			// Value of alpha changing. 1 means object hides and reveals instantly. 0.1 will cause object to (dis)appear smoothly.
	precision		= 5;			// Values precision.
	
	// ----------- Don't change anything below this line ------------ //
	
	objects		= [];
	wasAdded		= false;
	currentObj		= 0;
	nextObjTmrId	= 0;
	resetNextPlay	= null;


	add(objects)
	{
		var args		= [].slice.call(arguments);
		this.objects	= objects.join ? this.objects.concat(objects) : this.objects.concat(args);
		this.wasAdded	= true;
		
		return args[0];
	};

	addOnly(objects)
	{
		this.objects	= [].slice.call(arguments);
		this.wasAdded	= true;
	};

	isRegisteredKey(keycode)
	{
		for(var i in HOTKEYS)
		{
			if(HOTKEYS[i] == keycode) return true;
		}
		return false;
	};

	_onKeyDown(event)
	{
		// console.log("XMover._onKeyDown", event);
		
		var rnd			= function(value){ return this.roundTo(value, this.precision); }.bind(this);
		var obj			= this.objects[this.currentObj];
		
		if(!this.wasAdded || !this.isRegisteredKey(event.keyCode))
		{
			return;
		}
		
		event.preventDefault();
		
		switch(event.keyCode)
		{
			case HOTKEYS.LEFT:
				obj.x			-= (event.shiftKey ? this.posStepFast : event.altKey ? this.posStepSlow : this.posStep);
				obj.x			= rnd(obj.x);
				break;
			
			case HOTKEYS.RIGHT:
				obj.x			+= (event.shiftKey ? this.posStepFast : event.altKey ? this.posStepSlow : this.posStep);
				obj.x			= rnd(obj.x);
				break;
			
			case HOTKEYS.UP:
				obj.y			-= (event.shiftKey ? this.posStepFast : event.altKey ? this.posStepSlow : this.posStep);
				obj.y			= rnd(obj.y);
				break;
			
			case HOTKEYS.DOWN:
				obj.y			+= (event.shiftKey ? this.posStepFast : event.altKey ? this.posStepSlow : this.posStep);
				obj.y			= rnd(obj.y);
				break;
			
			case HOTKEYS.DECREASE_SCALE:
				obj.scale.x		= Math.max(0, obj.scale.x - (event.shiftKey ? this.rotStepFast : event.altKey ? this.rotStepSlow : this.rotStep));
				obj.scale.y		= Math.max(0, obj.scale.y - (event.shiftKey ? this.rotStepFast : event.altKey ? this.rotStepSlow : this.rotStep));
				obj.scale.x		= rnd(obj.scale.x);
				obj.scale.y		= rnd(obj.scale.y);
				break;
			
			case HOTKEYS.INCREASE_SCALE:
				obj.scale.x		= obj.scale.x + (event.shiftKey ? this.rotStepFast : event.altKey ? this.rotStepSlow : this.rotStep);
				obj.scale.y		= obj.scale.y + (event.shiftKey ? this.rotStepFast : event.altKey ? this.rotStepSlow : this.rotStep);
				obj.scale.x		= rnd(obj.scale.x);
				obj.scale.y		= rnd(obj.scale.y);
				break;
			
			case HOTKEYS.ROTATE_LEFT:
				obj.rotation	-= (event.shiftKey ? this.rotStepFast : event.altKey ? this.rotStepSlow : this.rotStep);
				obj.rotation	= rnd(obj.rotation);
				break;
			
			case HOTKEYS.ROTATE_RIGHT:
				obj.rotation	+= (event.shiftKey ? this.rotStepFast : event.altKey ? this.rotStepSlow : this.rotStep);
				obj.rotation	= rnd(obj.rotation);
				break;
			
			case HOTKEYS.DECREASE_ALPHA:
				obj.alpha		= Math.max(0, obj.alpha - this.alphaStep);
				break;
			
			case HOTKEYS.INCREASE_ALPHA:
				obj.alpha		= Math.min(1, obj.alpha + this.alphaStep);
				break;
			
			case HOTKEYS.PREV:
				obj				= this.nextObject(-1);
				break;
			
			case HOTKEYS.NEXT:
				obj				= this.nextObject(1);
				break;
		}
		
		var id			= obj.id != undefined ? obj.id : obj.title != undefined ? obj.title : obj.name != undefined ? obj.name : undefined;
		
		console.log(
			(id != undefined ? "{ id: " + id + "," : "{"),
			"x:", rnd(obj.x),
			", y:", rnd(obj.y),
			", rotation:", rnd(obj.rotation),
			", scale:{ x:", rnd(obj.scale.x), ", y:", rnd(obj.scale.y), "} }");
	};

	nextObject(increment)
	{
		this.resetNextPlay && this.resetNextPlay();
		
		this.currentObj += increment;
		
		if(this.currentObj < 0)
		{
			this.currentObj = this.objects.length - 1;
		}
		if(this.currentObj > this.objects.length - 1)
		{
			this.currentObj = 0;
		}
		
		if(this.objects[this.currentObj])
		{
			this.nextObjectPlay();
		}
		
		if(!this.objects[this.currentObj])
		{
			throw new Error("Current object is undefined or null"); 
		}
		
		return this.objects[this.currentObj];
	};

	nextObjectPlay()
	{
		var time	= 50;
		var formerY	= this.objects[this.currentObj].y;
		var formerT	= this.objects[this.currentObj].tint;
		var counter	= 0;
		var func	= function()
		{
			if(counter == 0) { this.objects[this.currentObj].y -= 10; }
			if(counter == 1) { this.objects[this.currentObj].y -= 3; this.objects[this.currentObj].tint = 0x000000; }
			if(counter == 2) { this.objects[this.currentObj].y += 3; }
			if(counter == 3) { this.objects[this.currentObj].y += 10; this.objects[this.currentObj].tint = 0xFFFFFF; }
			if(counter >= 3) { this.resetNextPlay = null; clearInterval(this.nextObjTmrId); }
			counter++;
		}.bind(this);
		
		this.resetNextPlay = function()
		{
			clearInterval(this.nextObjTmrId);
			this.objects[this.currentObj].y		= formerY;
			this.objects[this.currentObj].tint	= formerT;
		}.bind(this);
		
		this.nextObjTmrId	= setInterval(func, time);
	};

	roundTo(value, places)
	{
		places	= Math.pow(10, places); 
		return Math.round(value * places)/places;
	};

}

export let xmover = new XMover();

export default function xmove(objects)
{
	return xmover.add.apply(xmover, arguments);
}

window.addEventListener("keydown", xmover._onKeyDown.bind(xmover));
