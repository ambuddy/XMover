# XMover v.1.5

XMover is a tool helping you to interactively position any visual object on screen and view how its co0rdinates change in browser console.

Just add some objects to xmover in any part of code as follows:

```
  xmover.add(anyDisplayObject);
  xmover.add(myTextField, myPIXIContainer ... mySprite);
  xmover.add([myObj1, myObj2 ... myObjN]);
```
You may add as many objects as you want as many times as desired passing one object, or a bunch of comma separated objects or an array of objects.

Then you can move added objects one by one on the scene using arrow keys. Also you can rotate them using <> keys, hide and reveal using sqr bracket ([]) keys. Switching between objects performed by -+ keys. Once you switched to next object it jumps and blinks once.

As object's position and rotation changes these values are traced in console.
