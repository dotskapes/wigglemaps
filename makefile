all: deps build min

deps:
	npm install

build: 
	./node_modules/grunt/bin/grunt build

min: wigglemaps.js
	./node_modules/grunt/bin/grunt uglify
