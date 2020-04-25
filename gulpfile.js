
// Підключення плагінів Gulp
const gulp = require("gulp"),
  sass = require("gulp-sass"),
  plumber = require("gulp-plumber"),
  browserSync = require("browser-sync").create(),
  autoprefixer = require("gulp-autoprefixer"),
  uglify = require("gulp-uglify"),
  concat = require("gulp-concat"),
  rename = require("gulp-rename"),
  del = require("del");



// Task для компіляції SCSS в CSS, мініфікація, автопрефікси
gulp.task("scss", function() {
  return gulp
    .src("app/scss/**/*.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "compressed" })) //compressed expanded
    .pipe(rename({ suffix: ".min" })) // якщо outputStyle: compresed ()
    .pipe(plumber())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["> 0.1%"],
        
      })
    )
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.reload({ stream: true }));
});


// Del
gulp.task("clean", async function() {
  del.sync("dist/*")
});

//Task для CSS завантажених бібліотек
gulp.task("css", function() {
  return gulp.src([
    "node_modules/magnific-popup/dist/magnific-popup.css",
    // "node_modules/slick-carousel/slick/slick.css"
  ])
  .pipe(concat("_libs.scss"))
  .pipe(gulp.dest("app/scss"))
  .pipe(browserSync.reload({stream: true}))
});


// Task для відслідковування змін в HTML 
gulp.task("html", function() {
  return gulp.src("app/*.html")
   .pipe(browserSync.reload({stream: true}));

});


// Task для відслідковування змін в JS
gulp.task("script", function () {
  return gulp.src("app/js/*.js").pipe(browserSync.reload({ stream: true }));
});


// Task для JavaScript файлів
gulp.task("js", function() {
  return (
    gulp
      .src([
        "node_modules/jquery/dist/jquery.js",
        // "node_modules/slick-carousel/slick/slick.js",
        // "node_modules/magnific-popup/dist/jquery.magnific-popup.js",
      ])
      .pipe(plumber())
      .pipe(concat("all.min.js")) // якщо мініфакція одразу розширення min.js
      .pipe(uglify()) //мініфікація js
      .pipe(gulp.dest("app/js"))
      .pipe(browserSync.reload({ stream: true }))
  );
});


//Task для перенесення усіх файлів у папку dist
gulp.task("export", async function() {
  const buildHtml = gulp.src("app/*.html")
    .pipe(gulp.dest("dist"));

  const buildCss = gulp.src("app/css/**/*.css")
    .pipe(gulp.dest("dist/css"));

  const buildJS = gulp.src("app/js/**/*.js")
    .pipe(gulp.dest("dist/js"));

  const buildFont = gulp.src("app/font/**/*.*")
    .pipe(gulp.dest("dist/font"));

  const buildImage = gulp.src("app/img/**/*.*")
    .pipe(gulp.dest("dist/img"));

});

// Task для відслідковування зміну файлах
gulp.task("watch", function() {
    gulp.watch("app/scss/**/*.scss", gulp.parallel("scss"));
    gulp.watch("app/*.html", gulp.parallel("html"));
    gulp.watch("app/js/*.js", gulp.parallel("script"));
});

// LiveReload за допомогою Browser Sync
gulp.task("browser-sync", function () {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
});

// Task Build з видалення усіх файлів з папки dist
gulp.task("build", gulp.series("clean", "export"));


// Запуск Gulp з усіма завданнями
gulp.task("default", gulp.parallel("css", "scss", "js", "browser-sync", "watch")
);

