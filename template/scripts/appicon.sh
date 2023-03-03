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

case $2 in
    android)
        params="-A ic_launcher"
        ;;
    ios)
        params="-I";
        ;;
    *)
        IZI_ENV=""
        ;;
esac
icon="./icon/icon.$ext" 
if test -f "./icon/icon.$1.$ext"; then
    icon="./icon/icon.$1.$ext" 
fi



echo -e "\033[1;4;46;46mGenerate icon from $icon for platform $params\033[0m"
yarn iconset create $params $icon 

exit 0

