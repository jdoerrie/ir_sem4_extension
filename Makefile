# Optimize Flags: WHITESPACE_ONLY, SIMPLE, ADVANCED
all:
	java -jar bin/compiler.jar \
		-O SIMPLE \
		--js src/*.js content_script.js \
		--create_source_map bin/content.map \
		--source_map_format=V3 \
		--externs externs/chrome_extensions.js \
		--externs externs/jquery-1.9.js \
		--js_output_file bin/content_compiled.js
	java -jar bin/compiler.jar \
		-O SIMPLE \
		--js src/Settings.js listener.js \
		--create_source_map bin/listener.map \
		--source_map_format=V3 \
		--externs externs/chrome_extensions.js \
		--externs externs/jquery-1.9.js \
		--js_output_file bin/listener_compiled.js
	echo '//# sourceMappingURL=content.map'  >> bin/content_compiled.js
	echo '//# sourceMappingURL=listener.map' >> bin/listener_compiled.js
