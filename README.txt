Asteroid3D

Team Members:

Mike Partridge


To Play:

Dodge asteroids for as long as you can! Level goes up every 10 seconds, try for the highest level you can--my personal record is 19.


Controls:

UP or W to Thrust

LEFT/RIGHT or A/D to Turn

SPACE to Hyperspace

(There are some hidden controls for Dev)



The Gist:

The Physijs engine handles thrusting and asteroid collisions. The ship is a custom convex mesh and the asteroids are other various convex meshes (polyhedrons) or low poly sphere meshes. Turning is done with dirty rotations because that's how Asteroids did it (and because it's really hard to control true angular momemtum).

The displays, camera motion (when you crash), and initial asteroid velocity is all done manually and adjusted by tuning constants at the top of asteroids.js. The game detects a crash when you move out of the XZ plane you start in and begins the end game actions of moving the camera and displaying the game over message. In the future, this crash will be handled by a collision call back from Physijs. Reload the page to try again.

Based on the difficulty level, asteroids will be randomly spawned just off the screen heading towards the playing field. The field/board doesn't collide, it's just there for shadows to give the player a frame of reference. Asteroids will have a random starting position, random speed based on difficulty level, and start moving towards a random point on the board (so they always are a threat). Asteroids are removed from the scene when they are more than 1000 units away from center of field (field is 120x80 units).

The hyperspace feature (like the arcade game) instantly transports the player to a new random point on the board (dirty position), but maintains momemtum. The only thing preventing the player coming out of hyperspace inside an asteroid (and instantly dying) is luck.

Like the original game, this is on a torus--moving off the top edge transports you to the bottom edge and moving left or right does the same. However this time the asteroids are not on the torus, they pass through your torus and then out again unless they get reflected back into play by another asteroid. You are no longer responsible for destroying all of the asteroids, just surviving the onslaught as long as possible, a bit like tetris or other old 'play til you die' arcade games.
