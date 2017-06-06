# NewProject

This is a base for any new project complete with SASS, Gulp and package.json files. Feel free to use it to start any new projects. Instructions for how I set up my new projects are included below.


Project Initialization Process
 
Notes:
This project assumes the following:
  1. You have Gulp globally installed on your computer. If not then please visit the following link for directions. (http://gulpjs.com/)
  2. You are using Sass as a preprocessor.
  3. Your Sass project directory is based largely on The Sass Way (http://thesassway.com/beginner/how-to-structure-a-sass-project). Feel free to change it to suit your approach or likes.
 
The Gulpfile in this project will do the following:
 
During Development
 * Compile SASS files into CSS
 * Compile CoffeeScript files into JavaScript
 * Spin up a local webserver
 * Watch for file changes and refresh the web browser
 
During Production
 * Clean the dist folder
 * Concatenate and minify JavaScript and CSS files
 * Optimize images
 * Copy all dependencies to dist folder
 * Create a Sassdoc
 
Steps
 1. Clone this repository
 2. Open command line
 3. cd into project folder from command line
 4. Initialize Git repository with command “git init” if you have not already
 5. Initialize Node with command “npm init”
 6. Run “npm install” in the command line to install all dependencies
 7. Run “git commit -a -m ‘initial commit’ “ in the command to commit all new files
 8. Run gulp watch in the command line
