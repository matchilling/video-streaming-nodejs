.PHONY: default
default: help;

help:     ## Show this help
	@echo '--------------------------------------------------------------------------------'
	@echo 'Video streaming example with Node.js'
	@echo '--------------------------------------------------------------------------------'
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
	@echo '--------------------------------------------------------------------------------'

build:    ## Build the project image
	@docker build --tag 'video-streaming-nodejs:latest' -f './Dockerfile' .

start:    ## Run the project
	@docker run -it -p3000:3000 'video-streaming-nodejs:latest'
