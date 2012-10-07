all: build min

build: js/*
	python scripts/compile.py js/base.js wigglemaps.js

min: wigglemaps.js
	python scripts/closure.py wigglemaps.js