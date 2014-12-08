require('lazy-ass');
var ggit = require('ggit');
var check = require('check-more-types');
var q = require('q');
var R = require('ramda');

function toArray(x) {
  return Array.isArray(x) ? x : [x];
}

function zipBlames(filenames, blames) {
  la(check.array(blames), 'blame info', blames);
  console.log('found blame info for', blames.length, 'files');

  var lineBlames = blames.map(toArray);
  var fileBlame = R.zipObj(filenames, lineBlames);
  return fileBlame;
}

// assumes we are inside folder where filenames make sense
// probably inside git repo folder and filenames are relative
// to the repo's root
function commitForEachLine(filenames) {
  var blameForFiles = filenames.map(ggit.blame);
  return q.all(blameForFiles).then(
    R.lPartial(zipBlames, filenames)
  );
}

module.exports = check.defend(commitForEachLine,
  check.arrayOfStrings, 'need filenames');
