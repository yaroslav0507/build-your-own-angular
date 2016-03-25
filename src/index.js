'use strict';

import _ from 'lodash';

function sayHello (to){
    return _.template('Hello, <%= name %>')({name: to});
}

module.exports = {
    sayHello: sayHello
};