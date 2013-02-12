all: build min

build: src/*
	python scripts/compile.py src/base.js wigglemaps.js

min: wigglemaps.js
	python scripts/closure.py wigglemaps.js
