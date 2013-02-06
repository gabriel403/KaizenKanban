#!/bin/sh


SRCS=( dojo dojox dijit util library kk )

SAVE_IFS=$IFS
IFS=" "
SRCSTR="${SRCS[*]}"
IFS=$SAVE_IFS

SRCBAKDIR=dtk
DEPLOYDIR=deploy
DEPLOYDEST=heroku
DEPLOYBRANCH=master

set -x

# prep for build
cd src/
rm css/dojo/nihilo.css css/dojo/dojo.css css/dojo/dnd.css


# build
cd client-js/util/buildscripts/
./build.sh --dojoConfig ../../dojoConfig.js --profile ../../build.profile.js --release

# backup no deployable files to gitignored directory
cd ../../
mv $SRCSTR $SRCBAKDIR

# cleanup - stage 1
find . -type f -name '*.uncompressed.js' -print0 | xargs -0 rm -rdf
find . -type f -name '*.consoleStripped.js' -print0 | xargs -0 rm -rdf

# copy built files to dest
mv ${DEPLOYDIR}/dijit/themes/nihilo/nihilo.css ${DEPLOYDIR}/dojo/resources/dojo.css ${DEPLOYDIR}/dojo/resources/dnd.css ../css/dojo/
mv ${DEPLOYDIR}/* .

# cleanup - stage 2
rm -rf ${DEPLOYDIR}

# deploy
cd src/client-js
#git add -f dojo
#git add -f dojox
#git add -f dijit
#git commit -am "build"
#git push --force -u heroku master
#git reset --hard HEAD~1

# destroy built files
#rm -rf $SRCSTR

# restore backup
#mv ${SRCBCK}/* .


set +x
