#!/bin/bash

VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g')

npm run build
git add dist/*
git commit -m "$VERSION" package.json package-lock.json dist/ src/ push.sh;
git push origin master;
git tag $VERSION;
git push origin $VERSION;
npm publish --access=public


