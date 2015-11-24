Asteroid3D

Team Members:

Mike Partridge


To Play:

Dodge asteroids for as long as you can! Level goes up every 10 seconds, try for the highest level you can--my personal record is 20.


Controls:

UP or W to Thrust

LEFT/RIGHT or A/D to Turn

SPACE to Hyperspace

P to Pause

ENTER to restart after a death

(There are some hidden controls for Dev, set debug_mode=true in console to use them: y,u,i,o are all commands)


Reflection:

I did every part of this project myself. Files in the libs/ folder were taken in their entirety from threejs.org and other similar sources. Files in main/ are entirely of my own writing except that it should be noted that most of my javascript learning came from looking at other people's code and copying sections that seemed to create the behavior that I was seeking with changes to suit my particular needs. For example, all of the CSS design in display.js began as a copy of libs/stats.js and I then modified it as needed. I did not collaborate with anyone on this project nor did I share my code with anyone directly, however my code was freely available at cs.brandeis.edu/~mpartrid.


Additions since the Rough Copy:

Several small features have been added in various places. The core gameplay remains unchanged.

I have added a shield power up which allows the player to withstand a single hit from an asteroid (destroying the shield). This power up API is extensible to other types of power ups, however only the shield is implemented.

I added a debug mode, accessible by setting debug_mode=true in the console or in main.js which gives special controls to spawn extra asteroids, shield the ship, spawn shield power ups, and self-destruct the ship.

I added the ability to pause the game, which suspends everything in the simulation, but does not suspend rendering (nor the stats display).

I added background music which can be muted and unmuted. The music fades out when the player dies and restarts when the player begins a new game with the ENTER key if it was previously playing. If it was muted at death, when unmuted the music will restart from the beginning.

I added the ability to resize the window and have all elements rescale and reposition properly. Text elements do not rescale, but they do reposition to maintain their normal positions. This allows playing the game comfortably at as low as 640x480 resolution if necessary.

I fixed numerous bugs with the simulation, the bounds checking on asteroid collisions, and other aspects too numerous to mention.


The Gist: (This section unchanged from the rough copy)

The Physijs engine handles thrusting and asteroid collisions. The ship is a custom convex mesh and the asteroids are other various convex meshes (polyhedrons) or low poly sphere meshes. Turning is done with dirty rotations because that's how Asteroids did it (and because it's really hard to control true angular momemtum).

The displays, camera motion (when you crash), and initial asteroid velocity is all done manually and adjusted by tuning constants at the top of asteroids.js. The game detects a crash when you move out of the XZ plane you start in and begins the end game actions of moving the camera and displaying the game over message. In the future, this crash will be handled by a collision call back from Physijs. Reload the page to try again.

Based on the difficulty level, asteroids will be randomly spawned just off the screen heading towards the playing field. The field/board doesn't collide, it's just there for shadows to give the player a frame of reference. Asteroids will have a random starting position, random speed based on difficulty level, and start moving towards a random point on the board (so they always are a threat). Asteroids are removed from the scene when they are more than 1000 units away from center of field (field is 120x80 units).

The hyperspace feature (like the arcade game) instantly transports the player to a new random point on the board (dirty position), but maintains momemtum. The only thing preventing the player coming out of hyperspace inside an asteroid (and instantly dying) is luck.

Like the original game, this is on a torus--moving off the top edge transports you to the bottom edge and moving left or right does the same. However this time the asteroids are not on the torus, they pass through your torus and then out again unless they get reflected back into play by another asteroid. You are no longer responsible for destroying all of the asteroids, just surviving the onslaught as long as possible, a bit like tetris or other old 'play til you die' arcade games.
