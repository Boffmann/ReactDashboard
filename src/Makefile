TSC=tsc
# TSLINT=tslint

TS_SRC 	= $(shell find ./server -iname "*.ts")
TS_JS 	= $(TS_SRC:.ts=.js)

.PHONY: all js.stub

all: $(TS_SRC)
	$(TSC) $^

# $(TS_JS): %.js: %.ts js.stub
# 	$(TSLINT) $<

# js.stub: $(TS_SRC)
# 	$(TSC) $^
# 	@touch $@

retouch:
	for f in $(TS_SRC); do touch $$f; done

rebuild: retouch all
