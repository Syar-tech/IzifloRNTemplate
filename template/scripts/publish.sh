#!/bin/bash
# publish apk with env
# example of use 'yarn p dev android'


source ./scripts/apply_config.sh $1 $2

case $2 in

    a-android)
        echo 'Assemble sur Android'
        
        cd android && ENVFILE=".env.${IZI_ENV}" ./gradlew assembleRelease && cd ../
        ;;
    b-android)
        echo 'bundle sur Android'
        
        cd android && ENVFILE=".env.${IZI_ENV}" ./gradlew bundleRelease && cd ../
        ;;
    ios)
        echo 'Publication sur iOS'
        ;;
    *)
        echo 'OS non reconnu, essayez parmis : a-android, b-android, ios'
        ;;
esac

