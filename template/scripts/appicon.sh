#!/bin/bash
# run  apk with env
# example of use 'yarn r dev android'


source ./scripts/init.sh $1 $2 $3

if [ -z "$3" ]
then
        ext='svg'
else
        ext=$3
fi
if [ "$1" = "all" ]; then
    envs=(dev sprint maint trunk recette recette2 prod)
else
    envs=($1)
fi

case $2 in
    android)
        initParams="-A ic_launcher"
        ;;
    ios)
        initParams="-I";
        ;;
    *)
        ;;
esac

for env in "${envs[@]}"; do
    icon="./icon/icon.$ext" 
    params="$initParams"
    if test -f "./icon/icon.$env.$ext"; then
        icon="./icon/icon.$env.$ext" 
    fi

    #ios only
    if [ "$2" = "ios" ]; then
        params="$params --flavor $env"
    fi


    echo -e "\033[1;4;46;46mGenerate icon from $icon for platform $params and env $env\033[0m"
    yarn iconset create $params $icon 
done
exit 0

