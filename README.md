# Build Your Own Angular

Framework technologies and structure
------------------------------------
- npm
- gulp
- es6
- babel
- browserify
- karma
- mocha
- sinon
- chai
- istanbul
- eslint

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
$ git clone git@github.com:yaroslav0507/build-your-own-angular.git # or clone your own fork
$ npm install
$ npm start

$ npm test - to run tests
```

## Framework build process
Single `gulpfile.js` which compile es6 with browserify,
writes sourcemaps, watch changes, make rebundling and check framework files for code quality with eslint.

`.eslintrc`

```javascript
{
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "rules": {
    "quote-props": [2, "as-needed"]
  }
}
```

## Strict mode
In the development process of the framework I've used ES6 module syntax.
For this reason I've used `babel` transpiler in couple with `browserify` bundler.
This approach gives us an opportunity to write modules without 'use strict' directive. Babel adds 'use strict' globally after transpilation.
Besides `use strict` directive is used in every gulp task, config file and other files that does not transpiled by babel.

## Framework testing process
It uses next test frameworks: `browserify`, `mocha`, `chai`, `sinon-chai`,
it generates code coverage reports with `istanbul`.

## Code coverage report
Code coverage reports are generated by `browserify-istanbul`.
Reports are stored in the root folder of the framework in the `/coverage` folder.
![Code coverage](https://www.dropbox.com/s/gic4qqjuzh79nvt/Screen%20Shot%202016-02-18%20at%202.51.49%20PM.png?dl=1)
