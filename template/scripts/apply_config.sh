
source ./scripts/init.sh $1 $2

echo "Apply config : ${IZI_ENV}"
echo "   msal_config"

./scripts/env_to_file.sh ${IZI_ENV} json ./android/app/src/main/assets/msal_config

echo ""