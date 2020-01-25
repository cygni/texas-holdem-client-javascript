#!/bin/sh

docker run -it --mount type=bind,source="$(pwd)",target=/app --workdir /app node:13-stretch /bin/bash
