#!/bin/bash
# load conf for run and publish
IZI_ENV="$1";
SUFFIX_PARAMS="--appIdSuffix \"$1\"";
case $1 in

    prod | "p.dev")
        SUFFIX_PARAMS="";
        ;;
    recette | "p.recette")
        SUFFIX_PARAMS="--appIdSuffix \"recette\"";
        ;;
    recette2 | p.recette2)
        SUFFIX_PARAMS="--appIdSuffix \"recette2\"";
        ;;
    form | "p.form")
        SUFFIX_PARAMS="--appIdSuffix \"form\"";
        ;;
    sprint | "p.sprint")
        SUFFIX_PARAMS="--appIdSuffix \"sprint\"";
        ;;
    "dev.screen")
        #nothing to do
        ;;
    *)
        IZI_ENV="dev"
        ;;
esac
if [[ $2 = "ios" ]];
then
    SUFFIX_PARAMS='' #'--device';
fi
