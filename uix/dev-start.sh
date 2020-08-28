#!/bin/bash

docker run --rm -p 3000:3000 -v $(pwd)/src:/usr/app/src m-uix
#docker-compose up