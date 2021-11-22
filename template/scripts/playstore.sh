#!/bin/bash
# publish apk with env
# example of use 'yarn p dev android'



# To get hash key, from google play signature (Configuration > Intégrité de l application) : 
# $ echo <Certificat de signature> | xxd -r -p | base64

urle () { [[ "${1}" ]] || return 1; local LANG=C i x; for (( i = 0; i < ${#1}; i++ )); do x="${1:i:1}"; [[ "${x}" == [a-zA-Z0-9.~_-] ]] && echo -n "${x}" || printf '%%%02X' "'${x}"; done; echo; }


case $1 in

    bundle)

        cd android
        ./gradlew incrementVersionCode
        cd ../

        # echo '--------------'
        # echo 'Bundle Sprint'
        # echo '--------------'
          
          
        # ./scripts/apply_config.sh p.sprint android

        # cd android
        # ENVFILE=".env.p.sprint" ./gradlew bundleRelease
        # cd ../
  

        # echo "--------------"
        # echo "Bundle Recette"
        # echo "--------------"
                
        # ./scripts/apply_config.sh p.recette android

        # cd android
        # ENVFILE=".env.p.recette" ./gradlew bundleRelease
        # cd ../

        echo "--------------"
        echo "Bundle Prod"
        echo "--------------"
                
        ./scripts/apply_config.sh p.prod android

        cd android
        ENVFILE=".env.p.prod" ./gradlew bundleRelease
        cd ../

        open android/app/build/outputs/bundle/release

    ;;
    signkey)
        BASE=`echo $2 | xxd -r -p | base64`
        URLENC=`urle $BASE`
        echo ''
        echo 'vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv'
        echo "      base64 : $BASE"
        echo "   URLEncode : $URLENC" 
        echo '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^'
        echo ''
    ;;

    *)
        echo 'Command non connu essayez signkey ou bundle'
        ;;
esac

exit 0
