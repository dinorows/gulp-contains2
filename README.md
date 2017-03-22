# gulp-contains2 

Returns instance counts, or calls a callback, of string instances found in a file.
Extends gulp-contains where the script returns (by throwing an error) with the first instance found.

## Install

```
$ npm install --save-dev gulp-contains2
```

## Usage

The following code will return file locations and instance counts if "../node_modules" is found in any
Sass or SCSS file.

```js
var gulp = require('gulp');
var contains = require('gulp-contains2');

gulp.task('default', function () {
	gulp.src('./src/**/*.{sass, scss}')
		.pipe(contains('../node_modules'));
});
```

The contains function accepts a string, a regular expression or an array of either (any of
which, when matched, will increment count and returned).

You can also specify a callback function, in which you can handle the found predicate
yourself or choose to completely ignore it:

```js
var gulp = require('gulp');
var contains = require('gulp-contains2');

gulp.task('default', function () {
	gulp.src('./src/**/*.{sass, scss}')
		.pipe(contains({
			search: '../node_modules',
			onFound: function (string, file, cb) {
				// string is the string that was found
				// file is the vinyl file object
				// cb is the through2 callback

				// return false to continue the stream
			}
		}));
});
```

## License

Released under the Apache2 license.
