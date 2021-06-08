#!/bin/bash
# run  apk with env
# example of use 'yarn r dev android'


source ./scripts/apply_config.sh $1 $2 'r.'
 
ENVFILE=".env.${IZI_ENV}" yarn run $2 ${SUFFIX_PARAMS} $3

exit 0

