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

# .PHONY: deploy-s3-exporter
# deploy-s3-exporter:
# 	aws lambda update-function-code \
# 		--function-name vw-fs-review-data-export--s3-exporter \
# 		--zip-file "fileb://code/dist/s3Exporter.zip"

# .PHONY: deploy-ftp-publisher
# deploy-ftp-publisher:
# 	aws lambda update-function-code \
# 		--function-name vw-fs-review-data-export--ftp-publisher \
# 		--zip-file "fileb://code/dist/ftpPublisher.zip"

# .PHONY: deploy
# deploy:
# 	$(MAKE) deploy-importer
# 	$(MAKE) deploy-s3-exporter
# 	$(MAKE) deploy-ftp-publisher


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
