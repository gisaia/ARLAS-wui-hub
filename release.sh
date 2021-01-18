#!/bin/bash
set -e

function clean {
    ARG=$?
	echo "==> Exit status = $ARG"
    exit $ARG
}
trap clean EXIT

usage(){
	echo "Usage: ./release.sh -rel=X [--no-tests]"
  echo " -rel|--app-release   release arlas-wui-hub X version"
	echo " -dev|--app-dev       development arlas-wui-hub (-SNAPSHOT qualifier will be automatically added)"
	echo " --no-tests           do not run integration tests"
	exit 1
}

TESTS="YES"
for i in "$@"
do
case $i in
    -rel=*|--app-release=*)
    APP_REL="${i#*=}"
    shift # past argument=value
    ;;
    -dev=*|--app-dev=*)
    APP_DEV="${i#*=}"
    shift # past argument=value
    ;;
    --no-tests)
    TESTS="NO"
    shift # past argument with no value
    ;;
    *)
      # unknown option
    ;;
esac
done

VERSION="${APP_REL}"
DEV="${APP_DEV}"

echo "==> Get develop branch"
git checkout develop
git pull origin develop

if [ "$TESTS" == "YES" ]; then
  ng lint
  ng test
  ng e2e
else
  echo "==> Skip tests"
fi

echo "==> Merge develop into master"
git checkout master
git pull origin master
git merge origin/develop -m "Merge develop into master"

echo "==> Set version"
npm --no-git-tag-version version ${VERSION}
git add package.json

echo "  -- Create and push tag"
git tag -a v${VERSION} -m "Release prod version ${VERSION}"
git push origin v${VERSION}

echo "==> Generate CHANGELOG"
docker run -it --rm -v "$(pwd)":/usr/local/src/your-app gisaia/github-changelog-generator:latest github_changelog_generator \
  -u gisaia -p ARLAS-wui-hub --token b39ba8db7cfd32fcb0f7f9cf94a86eef6a663774 --no-pr-wo-labels --no-issues-wo-labels --no-unreleased \
  --issue-line-labels conf,documentation \
  --exclude-labels type:duplicate,type:question,type:wontfix,type:invalid \
  --bug-labels type:bug --enhancement-labels type:enhancement --breaking-labels type:breaking \
  --enhancement-label "**New stuff:**" --issues-label "**Miscellaneous:**"

echo "  -- Remove tag to add generated CHANGELOG"
git tag -d v${VERSION}
git push origin :v${VERSION}

echo "  -- Commit release version"
git commit -a -m "Release prod version ${VERSION}"
git tag v${VERSION}
git push origin v${VERSION}
git push origin master

echo "==> Docker"
docker build --no-cache --build-arg version=${VERSION} --tag gisaia/arlas-wui-hub:${VERSION} --tag gisaia/arlas-wui-hub:latest .

docker push gisaia/arlas-wui-hub:${VERSION}
docker push gisaia/arlas-wui-hub:latest

echo "==> Go back to develop branch and rebase"
git checkout develop
git pull origin develop
git rebase origin/master

npm --no-git-tag-version version "${DEV}-dev"

git commit -a -m "Set development version to ${DEV}-dev"
git push origin develop

echo "==> Well done :)"
