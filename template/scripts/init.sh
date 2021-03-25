#!/bin/bash
# load conf for run and publish
IZI_ENV='dev';
case $1 in

    prod)
        IZI_ENV="prod"
        ;;
    recette | recette1)
        IZI_ENV="recette"
        ;;
    recette2)
        IZI_ENV="recette2"
        ;;
    formation | form)
        ENV="formation"
        ;;

    local | sprint)
        IZI_ENV="sprint"
        ;;
     *)
        IZI_ENV="dev"
        ;;
esac