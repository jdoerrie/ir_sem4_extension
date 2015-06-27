# Optimize Flags: WHITESPACE_ONLY, SIMPLE, ADVANCED
COMPILER=java -jar bin/compiler.jar
OPTIMIZATION=ADVANCED
EXTERNS=externs/*.js
SRC_FORMAT=V3

all:	content listener

content:
	${COMPILER} \
	--compilation_level ${OPTIMIZATION} \
	--js src/*.js content_script.js \
	--create_source_map bin/content.map \
	--source_map_format ${SRC_FORMAT} \
	--externs ${EXTERNS} \
	--js_output_file bin/content-compiled.js

	echo '//# sourceMappingURL=content.map'  >> bin/content-compiled.js
listener:
	${COMPILER} \
	--compilation_level ${OPTIMIZATION} \
	--js src/*.js listener.js \
	--create_source_map bin/listener.map \
	--source_map_format ${SRC_FORMAT} \
	--externs ${EXTERNS} \
	--js_output_file bin/listener-compiled.js

	echo '//# sourceMappingURL=listener.map'  >> bin/listener-compiled.js

clean:
	rm bin/*.js bin/*.map
