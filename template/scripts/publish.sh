#!/bin/bash
# publish apk with env
# example of use 'yarn p dev android'

source ./scripts/apply_config.sh $1 $2

case $2 in

    apk)
    #
    #   build apk
    #
        echo -e "\033[1;4;46m Assemble sur Android \033[0m"
        
        cd android
        ./gradlew incrementVersionCode 
        if [ -z "$3" ]
        then
            VAR='store'
            echo  -e "\033[1;4;46m Build standard apk \033[0m"
        else
            VAR=$3
            echo  -e "\033[1;4;46m Build apk for variant : $VAR \033[0m"
        fi

        # capitalize
        VAR="$(tr '[:lower:]' '[:upper:]' <<< ${VAR:0:1})${VAR:1}"

        ENVFILE=".env.${IZI_ENV}" ./gradlew app:assemble${VAR}Release 
        cd ../
        open android/app/build/outputs/apk/${VAR}/release
        ;;
    store)
    #
    #   build bundle
    #
        echo -e "\033[1;4;46m Bundle sur Android \033[0m"
        
        cd android 
        ./gradlew incrementVersionCode 

        if [ -z "$3" ]
        then
            VAR='store'
            echo -e "\033[1;4;46m Build standard bundle \033[0m"
        else
            VAR=$3
            echo -e "\033[1;4;46m Build bundle for variant : $VAR \033[0m"
        fi

        # capitalize
        VAR="$(tr '[:lower:]' '[:upper:]' <<< ${VAR:0:1})${VAR:1}"

        ENVFILE=".env.p.${IZI_ENV}" ./gradlew bundle${VAR}Release 
        cd ../

        open android/app/build/outputs/bundle/${VAR}/release
        ;;
    install)
    
        if [ -z "$3" ]
        then
            VAR='store'
            echo -e "\033[1;4;46m Build standard install \033[0m"
        else
            VAR=$3
            echo -e "\033[1;4;46m Build install for variant : $VAR \033[0m"
        fi
        ENVFILE=".env.${IZI_ENV}" yarn run android ${SUFFIX_PARAMS} $4 --variant=${VAR}Release
        ;;
    ios)
    #
    #   Non géré 
    #
        echo -e "\033[1;4;43m Publication sur iOS \033[0m"
        ;;
    *)
        echo -e "\033[1;4;41m Commande non reconnu, essayez parmis : install, apk , store, ios \033[0m"
        exit 1
        ;;
esac

exit 0

