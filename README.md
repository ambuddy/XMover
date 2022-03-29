# XMover v.1.7

XMover is a tool helping you to interactively position any visual object on screen and view how its coordinates change in browser console.

XMover supposed to be used in graphic interfaces and games written in JavaScript.

Just add some objects to xmover in any part of code as follows:

```
  import xmove from './xmove.js'
  
  xmover.add(anyDisplayObject);
  xmover.add(myTextField, myPIXIContainer ... mySprite);
  xmover.add([myObj1, myObj2 ... myObjN]);
  xmove(anyDisplayObject);
  xmove([myObj1, myObj2 ... myObjN]);
```
You may add as many objects as you want as many times as desired passing one object, or a bunch of comma separated objects or an array of objects.

Then you can move added objects one by one on the scene using arrow keys. Also you can:
- rotate them using <> keys;
- hide and reveal using sqr bracket ([]) keys;
- scaling by 9 and 0;
- switching between objects performed by -+ keys. Once you switched to next object it jumps and blinks once.

As object's position and rotation changes these values are traced in console.


## Versions history:
1.7 - Added Alt-key functionality to slower moves<br>
1.6 - Added Scale change performed by keys "9" and "0".
