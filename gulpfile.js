const isDevelop = true;
const online = true;

const 
  { src, dest, parallel, series, watch } = require('gulp'),
  browserSync   = require('browser-sync').create(),
  sass          = require('gulp-sass'),
  autoprefixer  = require('gulp-autoprefixer'),
  cleanCss      = require('gulp-clean-css'),
  sourcemaps    = require('gulp-sourcemaps'),
  pug           = require('gulp-pug'),
  formatHtml    = require('gulp-format-html'),
  uglify        = require('gulp-uglify-es').default,
  concat        = require('gulp-concat'),
  rename        = require('gulp-rename'),
  gulpIf        = require('gulp-if'),
  del           = require('del'),
  plumber       = require('gulp-plumber'),
  notify        = require('gulp-notify'),
  ttf2woff      = require('gulp-ttf2woff'),
  ttf2woff2     = require('gulp-ttf2woff2'),
  svgsprite     = require('gulp-svg-sprite'),
  // imagemin      = require('gulp-imagemin'),
  // newer         = require('gulp-newer'),

  path = {
    build: {
      html: 'dist/',
      css:  'dist/css/',
      js:   'dist/js/',
      font: 'dist/fonts/',
      img:  'dist/img/'
    },
    src: {
      html: 'src/html/*.html',
      pug:  'src/pug/*.pug',
      sass: 'src/sass/*.sass',
      js:   'src/js/*.js',
      font: 'src/fonts/**/*.ttf',
      img:  'src/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
      icon: 'src/img/icons/*.svg',
      libs: {
        styles: 'src/libs/*.{css,sass,scss}',
        js:     'src/libs/*.js'
      }
    },
    watch: {
      html: 'src/html/**/*.html',
      pug:  'src/pug/**/*.pug',
      sass: 'src/sass/**/*.sass',
      js:   'src/js/**/*.js',
      img:  'src/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}'
    },
    clean: './dist'
  }

function browsersync() {
  browserSync.init({
    server: { baseDir: path.build.html },
    notify: false,
    online: online
  })
}

function libsJs() {
  return src(path.src.libs.js)
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(dest(path.build.js))
  .pipe(browserSync.stream())
}

function customJs() {
  return src(path.src.js)
  .pipe(gulpIf(isDevelop, sourcemaps.init()))
  .pipe(concat('main.min.js'))
  .pipe(gulpIf(!isDevelop, uglify()))
  .pipe(gulpIf(isDevelop, sourcemaps.write()))
  .pipe(dest(path.build.js))
  .pipe(browserSync.stream())
}

function libsCss() {
  return src(path.src.libs.styles)
  .pipe(concat('libs.min.css'))
  .pipe(cleanCss())
  .pipe(dest(path.build.css))
  .pipe(browserSync.stream())
}

function customCss() {
  return src(path.src.sass)
  .pipe(gulpIf(isDevelop, sourcemaps.init()))
  .pipe(plumber({
    errorHandler: notify.onError(err => {
      return {
        title: 'Sass',
        message: err.message
      }
    })
  }))
  .pipe(sass())
  .pipe(plumber.stop())
  .pipe(concat('main.min.css'))
  .pipe(autoprefixer({
    grid: true,
    overrideBrowserslist: ['last 5 versions']
  }))
  .pipe(gulpIf(!isDevelop, cleanCss({ level:2 })))
  .pipe(gulpIf(isDevelop, sourcemaps.write()))
  .pipe(dest(path.build.css))
  .pipe(browserSync.stream())
}

function pugToHtml() {
  return src(path.src.pug)
  .pipe(plumber({
    errorHandler: notify.onError(err => {
      return {
        title: 'Pug',
        message: err.message
      }
    })
  }))
  .pipe(pug())
  .pipe(plumber.stop())
  .pipe(formatHtml())
  .pipe(dest(path.build.html))
  .pipe(browserSync.stream())
}

function fonts() {
  del(path.build.font + '*');
  src(path.src.font)
  .pipe(ttf2woff())
  .pipe(dest(path.build.font));
  return src(path.src.font)
  .pipe(ttf2woff2())
  .pipe(dest(path.build.font))
}

function icons() {
  return src(path.src.icon)
  .pipe(svgsprite({
    mode: {
      stack: {
        sprite: '../icons.svg',
        example: true
      }
    }
  }))
  .pipe(dest(path.build.img))
}

function startwatch() {
  watch(path.watch.sass, customCss);
  watch(path.src.libs.styles, libsCss);
  watch(path.watch.js, customJs);
  watch(path.src.libs.js, libsJs);
  watch(path.watch.pug, pugToHtml);
}

exports.browsersync = browsersync;
exports.styles      = parallel(libsCss, customCss);
exports.scripts     = parallel(libsJs, customJs);
exports.pug         = pugToHtml;
exports.fonts       = fonts;
exports.icons       = icons;

exports.default     = parallel(libsCss, customCss, libsJs, customJs, pugToHtml, browsersync, startwatch);