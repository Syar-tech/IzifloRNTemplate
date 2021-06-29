#!/bin/bash
# publish apk with env
# example of use 'yarn p dev android'


source ./scripts/apply_config.sh $1 $2

case $2 in

    apk)
        echo 'Assemble sur Android'
        
        cd android
        ./gradlew incrementVersionCode 
        ENVFILE=".env.${IZI_ENV}" ./gradlew assembleRelease 
        cd ../
        open android/app/build/outputs/apk/release
        ;;
    store)
        echo 'bundle sur Android'
        
        cd android 
        ./gradlew incrementVersionCode 
        ENVFILE=".env.p.${IZI_ENV}" ./gradlew bundleRelease 
        cd ../

        open android/app/build/outputs/bundle/release
        ;;
    ios)
        echo 'Publication sur iOS'
        ;;
    *)
        echo 'OS non reconnu, essayez parmis : apk , store, ios'
        ;;
esac

exit 0

