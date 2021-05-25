#!/bin/bash
# publish apk with env
# example of use 'yarn p dev android'


source ./scripts/apply_config.sh $1 $2

case $2 in

    android)
        echo 'Publication sur Android'
        
        cd android && ENVFILE=".env.${IZI_ENV}" ./gradlew bundleRelease && cd ../
        ;;
    ios)
        echo 'Publication sur iOS'
        ;;
    *)
        echo 'OS non reconnu'
        ;;
esac

