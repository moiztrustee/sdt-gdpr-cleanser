.PHONY: start-local
start-local:
	./local/start.sh

.PHONY: stop-local
stop-local:
	./local/stop.sh

.PHONY: assemble
assemble:
	$(MAKE) -C toolbox toolbox_assemble

.PHONY: deploy-cleanser
deploy-cleanser: 
	aws lambda update-function-code \
		--function-name sdt-gdpr--cleanser \
		--zip-file "fileb://code/dist/cleanser.zip"	

.PHONY: deploy-scanner
deploy-scanner: 
	aws lambda update-function-code \
		--function-name sdt-gdpr--scanner \
		--zip-file "fileb://code/dist/scanner.zip"

.PHONY: deploy
deploy-all:
	$(MAKE) deploy-cleanser
	$(MAKE) deploy-scanner

.PHONY: initialize
initialize:
	$(MAKE) -C toolbox toolbox_initialize

.PHONY: configure-local
configure-local:
	./local/configure.sh

.PHONY: do_test
do_test:
	$(MAKE) -C toolbox toolbox_test

.PHONY: test
test:
	$(MAKE) configure-local
	$(MAKE) do_test
