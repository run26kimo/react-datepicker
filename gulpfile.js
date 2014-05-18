// Generated by CoffeeScript 1.7.1
(function() {
  var GulpEste, dirs, este, gulp, paths, runSequence;

  gulp = require('gulp');

  GulpEste = require('gulp-este');

  runSequence = require('run-sequence');

  este = new GulpEste(__dirname, true, '../../../..');

  paths = {
    stylus: ['src/css/datepicker.styl'],
    coffee: ['bower_components/este-library/este/**/*.coffee', 'src/**/*.coffee'],
    jsx: ['src/**/*.jsx'],
    js: ['bower_components/closure-library/**/*.js', 'bower_components/este-library/este/**/*.js', 'src/**/*.js', 'tmp/**/*.js', '!**/build/**'],
    compiler: 'bower_components/closure-compiler/compiler.jar',
    externs: ['bower_components/react-externs/externs.js'],
    thirdParty: {
      development: [],
      production: []
    }
  };

  dirs = {
    googBaseJs: 'bower_components/closure-library/closure/goog',
    watch: ['src']
  };

  gulp.task('stylus', function() {
    return este.stylus(paths.stylus);
  });

  gulp.task('coffee', function() {
    return este.coffee(paths.coffee);
  });

  gulp.task('jsx', function() {
    return este.jsx(paths.jsx);
  });

  gulp.task('transpile', function(done) {
    return runSequence('stylus', 'coffee', 'jsx', done);
  });

  gulp.task('deps', function() {
    return este.deps(paths.js);
  });

  gulp.task('concat-deps', function() {
    return este.concatDeps();
  });

  gulp.task('compile-datepicker', function() {
    return este.compile(paths.js, 'build', {
      fileName: 'datepicker.min.js',
      compilerPath: paths.compiler,
      compilerFlags: {
        closure_entry_point: 'misino.ui.datepicker.DatePicker',
        externs: paths.externs,
        warning_level: 'QUIET'
      }
    });
  });

  gulp.task('concat-all', function() {
    return este.concatAll({
      'build/react-datepicker-thirdparty.js': paths.thirdParty
    });
  });

  gulp.task('js', function(done) {
    return runSequence.apply(null, [este.shouldCreateDeps() ? 'deps' : void 0, 'concat-deps', 'compile-datepicker', 'concat-all', done].filter(function(task) {
      return task;
    }));
  });

  gulp.task('build', function(done) {
    return runSequence('transpile', 'js', done);
  });

  gulp.task('watch', function() {
    return este.watch(dirs.watch, {
      coffee: 'coffee',
      js: 'js',
      jsx: 'jsx',
      styl: 'stylus'
    }, function(task) {
      return gulp.start(task);
    });
  });

  gulp.task('run', function(done) {
    return runSequence.apply(null, ['watch', done].filter(function(task) {
      return task;
    }));
  });

  gulp.task('default', function(done) {
    return runSequence('build', 'run', done);
  });

}).call(this);
