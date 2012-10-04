all: combine

combine: js/*
	python build/combine.py
	java -jar ~/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar -o wigglemaps.min.js wigglemaps.combined.js
	rm wigglemaps.combined.js