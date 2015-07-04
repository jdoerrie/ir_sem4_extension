# Optimize Flags: WHITESPACE_ONLY, SIMPLE, ADVANCED
COMPILER=java -jar bin/compiler.jar
OPTIMIZATION=NONE
EXTERNS=externs/*.js
SRC_FORMAT=V3

all:	content background

content:
ifeq (${OPTIMIZATION}, NONE)
	cat src/*.js content.js > bin/content-compiled.js
else
	${COMPILER} \
	--compilation_level ${OPTIMIZATION} \
	--js src/*.js content.js \
	--create_source_map bin/content.map \
	--source_map_format ${SRC_FORMAT} \
	--externs ${EXTERNS} \
	--js_output_file bin/content-compiled.js
	echo '//# sourceMappingURL=content.map'  >> bin/content-compiled.js
endif

background:
ifeq (${OPTIMIZATION}, NONE)
	cat src/*.js background.js > bin/background-compiled.js
else
	${COMPILER} \
	--compilation_level ${OPTIMIZATION} \
	--js src/Settings.js background.js \
	--create_source_map bin/background.map \
	--source_map_format ${SRC_FORMAT} \
	--externs ${EXTERNS} \
	--js_output_file bin/background-compiled.js
	echo '//# sourceMappingURL=background.map'  >> bin/background-compiled.js
endif

clean:
	rm bin/*.js bin/*.map
