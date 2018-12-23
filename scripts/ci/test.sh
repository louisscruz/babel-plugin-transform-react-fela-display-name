#!/usr/bin/env bash

set -e

echo 'travis_fold:start:VALIDATE_CODECOV_CONFIG'

cat ./codecov.yml | curl -s --data-binary @- https://codecov.io/validate --connect-timeout 5 -- max-time 5 --retry 5 --retry-delay 0 --retry-max-time 30 | grep Valid! || {
  echo 'Failed to validate codecov.yml with Codecov. This either means that file is invalid or Codecov can not currently be reached.'
  exit 1
}

echo 'travis_fold:end:VALIDATE_CODECOV_CONFIG'

echo 'travis_fold:start:INSTALL_CODECOV'

yarn global add codecov

echo 'travis_fold:end:INSTALL_CODECOV'

echo 'travis_fold:start:JEST'

yarn test --coverage

echo 'travis_fold:end:JEST'

echo 'travis_fold:start:CODECOV'

codecov

echo 'travis_fold:end:CODECOV'
