'use strict';

var through = require('through2');
var gutil = require('gulp-util');

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

module.exports = function gulpContains(options) {
	if (typeof options === 'string' || options instanceof RegExp || Array.isArray(options)) {
		options = { search: options };
	}

	options.onFound = options.onFound || function (string, file, cb) {
		var error = 'Your file contains "' + string + '", it should not.';
		cb(new gutil.PluginError('gulp-contains2', error));
	};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-contains2', 'Streaming not supported'));
			return;
		}

		if (!options.search) {
			cb(new gutil.PluginError('gulp-contains2', 'You did not specify a valid search string'));
			return;
		}

		//if ((file.history.indexOf('gulpfile.js') == -1))
		if (!endsWith(file.history.toString(), 'gulpfile.js'))
		{
			var found = stringMatches(file.contents.toString(enc), options.search);

			if (found) {
				// You can return false to ignore the error
				var cancel = options.onFound(found, file, cb);

				if (cancel !== false) {
					//console.log('returning');
					//console.log(file.history.toString());
					//return;
				}
				//console.log('no return');
			}
		}

		cb(null, file);
	});
};

function keywordOccurrences(string, subString, allowOverlapping, caseInsensitive, wholeWord)
{
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1); //deal with empty strings

    if(caseInsensitive)
    {            
        string = string.toLowerCase();
        subString = subString.toLowerCase();
    }

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length,
        stringLength = string.length,
        subStringLength = subString.length;

    while (true)
    {
        pos = string.indexOf(subString, pos);
        if (pos >= 0)
        {
            var matchPos = pos;
            pos += step; //slide forward the position pointer no matter what

            if(wholeWord) //only whole word matches are desired
            {
                if(matchPos > 0) //if the string is not at the very beginning we need to check if the previous character is whitespace
                {                        
                    if(!/[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&\(\)*+,\-.\/:;<=>?@\[\]^_`{|}~]/.test(string[matchPos - 1])) //ignore punctuation
                    {
                        continue; //then this is not a match
                    }
                }

                var matchEnd = matchPos + subStringLength;
                if(matchEnd < stringLength - 1)
                {                        
                    if (!/[\s\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&\(\)*+,\-.\/:;<=>?@\[\]^_`{|}~]/.test(string[matchEnd])) //ignore punctuation
                    {
                        continue; //then this is not a match
                    }
                }
            }

            ++n;                
        } else break;
    }
    return n;
}

function stringMatches(str, search) {
	if (typeof search === 'string') {
		//~dinorows: We comment out the original (gulp-contains) return
		// and tack on a count as well so that similar items found are counted
		//return (str.indexOf(search) !== -1) ? search : false;
		var count = keywordOccurrences(str, search, false, true, false);
		if (0 == count)
			return false;
		else
			return search + ':|' + count + '|';
	}
	if (search instanceof RegExp) {
		return (str.match(search)) ? search : false;
	}

	var t = [];
	var index = 0;
	for (var i = 0; i < search.length; i++) {
		var ret = stringMatches(str, search[i]);
		if (ret) {
			//~dinorows: We comment out the original (gulp-contains) return,
			// and instead store all finds in an array
			//return search[i];
			t[index] = ret;
			index++;
		}
	}
	
	// ~dinorows: We comment out the original return and return
	// false only if we found no matches, otherwise the array
	//return false;
	if (0 < index)
		return t;
	else
		return false;
}