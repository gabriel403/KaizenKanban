#!/bin/sh

set -x

# prep for build
cd source/
rm css/dojo/nihilo.css css/dojo/dojo.css css/dojo/dnd.css

cd client-js/
rm -rf nls dojo.js

# build
cd dtk/util/buildscripts/
./build.sh --dojoConfig ../../../dojoConfig.js --profile ../../../build.profile.js --release

# copy built files to dest
cd ../../../
cp -R deploy/dojo/dojo.js deploy/dojo/nls .
cp deploy/dijit/themes/nihilo/nihilo.css deploy/dojo/resources/dojo.css deploy/dojo/resources/dnd.css ../css/dojo/

# cleanup
rm -rf deploy
find . -type f -name '*.uncompressed.js' -print0 | xargs -0 rm -rdf
find . -type f -name '*.consoleStripped.js' -print0 | xargs -0 rm -rdf

set +x