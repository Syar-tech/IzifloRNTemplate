#!/bin/bash
# run  apk with env
# example of use 'yarn r dev android'


if [ -z "$1" ]
then
        echo -e "\033[1;4;41m Branch name missing! \033[0m"
        exit 1
fi

git tag "archive/$1" $1

git branch -D $1

git push origin :$1

git push --tags


exit 0

