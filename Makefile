repo ?= "mirrors.tencent.com/bk-award"
version ?= "development"
platform ?= "linux/amd64,linux/arm64"

build: build-api

build-api:
	docker buildx build . --platform ${platform} -t ${repo}/api:${tag} --push
