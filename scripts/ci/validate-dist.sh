#!/usr/bin/env bash

set -e

echo 'travis_fold:start:MOVE_DIST'

mv dist original-dist

echo 'travis_fold:end:MOVE_DIST'

echo 'travis_fold:start:BUILD'

yarn build

echo 'travis_fold:end:BUILD'

echo 'travis_fold:start:VALIDATE_DIST'

if [[ $(diff -r original-dist dist) ]]; then
  echo 'The built dist failed validation. This likely means that you forgot to run "yarn build" and check in the resulting dist folder.'
  exit 1
else
  echo 'The dist folder passed validation!'
fi

echo 'travis_fold:end:VALIDATE_DIST'
