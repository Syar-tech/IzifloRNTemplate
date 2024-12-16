#!/bin/bash
# run  apk with env
# example of use 'yarn r dev android'
adb devices | grep  "device$" &> /dev/null #&& echo "matched"
 if [ $? == 1 ]; then
        echo -e "\033[1;4;41m No devices attached! \033[0m"
exit 1;
 fi

source ./scripts/apply_config.sh $1 $2 'r.' 
if [ -z "$3" ]
then
        VAR='store'
        echo -e "\033[1;4;46;46mBuild standard Debug\033[0m"
else
        VAR=$3
        echo -e "\033[1;4;46m Build Debug for variant : $VAR \033[0m"
fi

yarn appicon $1 $2

ENVFILE=".env.${IZI_ENV}" yarn run $2 ${SUFFIX_PARAMS} $4 --variant=${VAR}Debug

exit 0

