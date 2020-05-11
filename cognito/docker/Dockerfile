FROM python:3.8-alpine

RUN apk add --no-cache --virtual builddeps gcc musl-dev && \
   pip --no-cache-dir install aws-sam-cli awscli && \
   apk del builddeps

RUN apk add --update nodejs nodejs-npm

RUN	adduser -s /bin/bash samcli \
	--disabled-password \
	&& echo 'samcli ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers


WORKDIR /cognito