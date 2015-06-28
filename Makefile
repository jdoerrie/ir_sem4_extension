# Optimize Flags: WHITESPACE_ONLY, SIMPLE, ADVANCED
COMPILER=java -jar bin/compiler.jar
OPTIMIZATION=SIMPLE
EXTERNS=externs/*.js
SRC_FORMAT=V3

all:	content background

content:
	# ${COMPILER} \
	--compilation_level ${OPTIMIZATION} \
	--js src/*.js content_script.js \
	--create_source_map bin/content.map \
	--source_map_format ${SRC_FORMAT} \
	--externs ${EXTERNS} \
	--js_output_file bin/content-compiled.js

	# echo '//# sourceMappingURL=content.map'  >> bin/content-compiled.js
	 cat src/*.js content_script.js > bin/content-compiled.js
background:
	# ${COMPILER} \
	--compilation_level ${OPTIMIZATION} \
	--js src/*.js background.js \
	--create_source_map bin/background.map \
	--source_map_format ${SRC_FORMAT} \
	--externs ${EXTERNS} \
	--js_output_file bin/background-compiled.js

	# echo '//# sourceMappingURL=background.map'  >> bin/listener-compiled.js
	cat src/*.js background.js > bin/listener-compiled.js

clean:
	rm bin/*.js bin/*.map
