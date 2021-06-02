#!/bin/bash
# create new template


DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

echo "remove node_module"
rm -f -r ${DIR}/template/node_modules
echo "remove ios/Pods"
rm -f -r ${DIR}/template/ios/Pods

npx react-native init $1 --template ${DIR} 