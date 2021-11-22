#!/bin/bash
# publish apk with env
# example of use 'yarn p dev android'


source ./scripts/apply_config.sh $1 $2

case $2 in

    apk)
    #
    #   build apk
    #
        echo 'Assemble sur Android'
        
        cd android
        ./gradlew incrementVersionCode 
        ENVFILE=".env.${IZI_ENV}" ./gradlew app:assembleRelease 
        cd ../
        open android/app/build/outputs/apk/release
        ;;
    store)
    #
    #   build bundle
    #
        echo 'Bundle sur Android'
        
        cd android 
        ./gradlew incrementVersionCode 
        ENVFILE=".env.p.${IZI_ENV}" ./gradlew bundleRelease 
        cd ../

        open android/app/build/outputs/bundle/release
        ;;
    install)
    #
    #   INSTALL apk to device
    #
        echo 'Assemble sur Android and install'
        
        cd android
        echo 'Get package name ...'
        APP_ID=`./gradlew -q getAppId | tail -n 1`
        echo "    Package : ${APP_ID}"

        echo 'Increment build number...'
        VERSION=`./gradlew -q incrementVersionCode | tail -n 1`
        echo "    Version : ${VERSION}"

        echo "Build Apk ..."
        ENVFILE=".env.${IZI_ENV}" ./gradlew app:assembleRelease 
        cd ../
        
        FULLNAME="${APP_ID}.${IZI_ENV}-${VERSION}-release.apk"
        echo "Apk name : ${FULLNAME}"

        echo "install apk ..."
        FILE="android/app/build/outputs/apk/release/${FULLNAME}"
        if test -f "$FILE";then
            adb install -r $FILE
        else 
            echo "Le fichier ${FILE} est introuvable."
            exit 1
        fi;

        ;;
    ios)
    #
    #   Non géré 
    #
        echo 'Publication sur iOS'
        ;;
    *)
        echo 'Commande non reconnu, essayez parmis : apk , store, ios'
        exit 1
        ;;
esac

exit 0

