var semver      = require('semver');
var gulp        = require('gulp');
var babel       = require('gulp-babel');
var sourcemaps  = require('gulp-sourcemaps');
var git         = require('gulp-git');
var bump        = require('gulp-bump');
var tagVersion  = require('gulp-tag-version');
var buildDevPath     = './build';
var buildReleasePath = './release';

// Watch JS/JSX and Sass files
gulp.task('watch', [ 'build', 'build:other' ], function() {
  gulp.watch('src/**/*.js', [ 'build', 'build:other' ]);
});

// Watch JS/JSX and Sass files
gulp.task('build', [ 'build:other' ], build(buildDevPath));
gulp.task('build:other', move(buildDevPath));

gulp.task('build:release', [ 'build:release:other' ], build(buildReleasePath));
gulp.task('build:release:other', move(buildReleasePath));

function move(dest) {
  return function() {
    return gulp
      .src('./src/**/*.json')
      .on('error', console.error)
      .pipe(gulp.dest(dest));
  }
}

function build(dest) {
  return function() {
    return gulp
      .src('./src/**/*.js')
      .pipe(sourcemaps.init())
      .pipe(babel())
      .on('error', console.error)
      .pipe(sourcemaps.write('.', {
        includeContent: false,
        sourceRoot: '../src'
      }))
      .pipe(gulp.dest(dest));
  }
}

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance) {
  var nowVersion = require('./package.json').version;
  var nextVersion = semver.inc(nowVersion, importance);
  
  // get all the files to bump version in
  return gulp.src('./package.json')
  // bump the version number in those files
    .pipe(bump({ type: importance }))
    // save it back to filesystem
    .pipe(gulp.dest('./'))
    // commit the changed version number
    .pipe(git.commit(`Bumped v${ nowVersion } to v${ nextVersion } with type: ${ importance }`))
    // **tag it in the repository**
    .pipe(tagVersion());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });

gulp.task('default', [ 'build' ]);