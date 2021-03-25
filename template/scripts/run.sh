#!/bin/bash
# run  apk with env


source ./scripts/apply_config.sh $1

ENVFILE=".env.${IZI_ENV}" yarn run $2

