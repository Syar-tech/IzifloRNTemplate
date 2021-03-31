#!/bin/bash
# load conf for run and publish
IZI_ENV='dev';
SUFFIX_PARAMS="--appIdSuffix \"$1\"";
case $1 in

    prod)
        IZI_ENV="prod"
        SUFFIX_PARAMS="";
        ;;
    recette | recette1)
        IZI_ENV="recette"
        ;;
    recette2)
        IZI_ENV="recette2"
        ;;
    formation | form)
        ENV="formation"
        SUFFIX_PARAMS="--appIdSuffix \"form\"";
        ;;

    local | sprint)
        IZI_ENV="sprint"
        SUFFIX_PARAMS="--appIdSuffix \"local\"";
        ;;
     *)
        IZI_ENV="dev"
        ;;
esac