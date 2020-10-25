TSC=tsc
# TSLINT=tslint

TS_SRC 	= $(shell find ./server ./database -iname "*.ts")
TS_JS 	= $(TS_SRC:.ts=.js)

.PHONY: all js.stub

all: $(TS_SRC)
	$(TSC) $^
	node server/server.js

retouch:
	for f in $(TS_SRC); do touch $$f; done

rebuild: retouch all
