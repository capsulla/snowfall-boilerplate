# Snowfall Boilerplate

End-to-end web project based on three stages:
1. Design (<a href="https://www.sketchapp.com/">Sketch</a>)
2. Front-end (HTML5/CSS/JS/SASS)
3. Back-end (<a href="https://wordpress.org/">WordPress</a>)

## Features

### Design (/design/)
- Sketch template file with:
 - Desktop, tablet and phone artboards
 - Default web icons, tiles and favicons 
 - WordPress screenshot artboards

### Front-end (/front-end/)
- HTML5 starter template files
- <a href="https://github.com/thedaviddias/Front-End-Checklist">Front-end checklist</a> ready
- <a href="https://sass-lang.com/">SASS</a> ready
- <a href="https://www.browsersync.io/">Browser Live Reloading</a>

### Back-end (/back-end/)
- WordPress latest version download and unzip to workspace
- PHP server proxy ready 
- Theme Starter template boilerplate
- <a href="https://www.browsersync.io/">Browser Live Reloading</a>

### Automation
- HTML minify on build
- JS minify on build
- Optmized Images on build
- <a href="https://www.browsersync.io/">BrowserSync Live Reloading</a>


## Installation

1. Install Apache, MySQL and PHP to run WordPress (e.g.: [XAMPP](https://www.apachefriends.org/download.html), [MAMP](https://www.mamp.info/en/))
2. Start servers
3. Create a database for Wordpress
4. [Install npm](https://www.npmjs.com/get-npm)
5. [Install Gulp](https://gulpjs.com)
6. Run installation on terminal: 

```terminal
    npm install 
```

# Usage 

## Front-end

- `frontend:start` - Starts Browser Live reloading and wath SASS files.
- `frontend:build` - Minify HTML/CSS/JS, Optimize images and copy do dist folder.

## Back-end

- `backend:install` - Download WordPress latest version, unzip it and setup a server folder.
- `backend:start` -  Starts Browser Live reloading and wath SASS files.

## Release notes

### 0.0.1

- Import <a href="https://github.com/marceloglacial/snowflake-boilerplate">Snowflake</a> and <a href="https://github.com/marceloglacial/iceberg-boilerplate">Iceberg boilerplate</a>'s files
- Folders structures
- Create readme
- Initial commit