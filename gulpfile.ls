gulp = require \gulp
addsrc = require \gulp-add-src
livescript = require \gulp-livescript
concat = require \gulp-concat
uglify = require \gulp-uglify
del = require \del
amd = require \amd-optimize

paths = 
  lss: \src/**/*.ls
  scripts: \src/**/*.js
  libs:	\lib/**/*.js

gulp.task \clean (cb) ->
  del [\js] cb

gulp.task \scripts, [] ->
  gulp.src paths.lss
    .pipe livescript()
    .pipe addsrc paths.scripts
    .pipe amd \main
    .pipe uglify do
      mangle: false
    .pipe concat \script.js
    .pipe gulp.dest 'js/'

gulp.task \libs, [\clean] ->
  gulp.src paths.libs
    .pipe gulp.dest 'js/lib'

gulp.task \watch ->
  gulp.watch paths.lss, [\scripts]
  gulp.watch paths.scripts, [\scripts]
  gulp.watch paths.libs, [\libs]

gulp.task \default, [\clean, \watch, \scripts, \libs]