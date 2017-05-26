# Simple editor

### Tech stack:
* [Docker](https://www.docker.com)
* [Docker Compose](https://docs.docker.com/compose/)
* [bacon.js](http://baconjs.github.io)
* [Jquery](https://jquery.com)
* [Grunt](http://gruntjs.com)

### Why use docker?
Because is the best and more safe way to let the dependencies separated.

### Why use baconjs?
Baconjs is a functional reactive lib and this helps a lot to avoid mess up with the code when we attach the events or deal with the states of an object.

### How can I execute?
#### With docker:
you will need to have installed Docker and docker-compose, with this two dependencies you just need run the command `docker-compose up editor_prod`, this will build the image and start the server on the port localhost:9000.
> If you are using OSx, you will need to get the container IP to use instead of `localhost`

#### Without docker:
1. npm install
2. grunt server:dist
3. access `localhost:9000`

### What happens when I build to prod?
All this scripts and stylesheets will be concatenated and moved to a temporary folder, to be minifed and renamed with a hash to avoid cache issues after the updates.
After all scripts and stylesheets ready the files will be set on index.html.
