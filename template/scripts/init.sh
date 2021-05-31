#!/bin/bash
# load conf for run and publish
IZI_ENV="$3dev";
SUFFIX_PARAMS="--appIdSuffix \"$1\"";
case $1 in

    prod)
        IZI_ENV="$3prod"
        SUFFIX_PARAMS="";
        ;;
    recette | recette1)
        IZI_ENV="$3recette"
        ;;
    recette2)
        IZI_ENV="$3recette2"
        ;;
    formation | form)
        IZI_ENV="$3formation"
        SUFFIX_PARAMS="--appIdSuffix \"form\"";
        ;;
    local | sprint)
        IZI_ENV="$3sprint"
        SUFFIX_PARAMS="--appIdSuffix \"local\"";
        ;;
    *)
        IZI_ENV="$3dev"
        ;;
esac
if [[ $2 = "ios" ]];
then
    SUFFIX_PARAMS='' #'--device';
fi
