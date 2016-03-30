'use strict';
import _ from 'lodash';

export default class Scope {
    constructor() {
        this.$$watchers = [];
    }

    _initWatchVal(){}

    $watch(watchFn, listenerFn) {
        let watcher = {
            watchFn: watchFn,
            listenerFn: listenerFn || function(){},
            last: this._initWatchVal
        };
        this.$$watchers.push(watcher);
    }

    $digest() {
        let oldValue,
            newValue;

        _.forEach(this.$$watchers, watcher => {
            newValue = watcher.watchFn(this);
            oldValue = watcher.last;

            if (newValue !== oldValue) {
                watcher.last = newValue;
                watcher.listenerFn(newValue, (oldValue === this._initWatchVal ? newValue : oldValue), this);
            }
        })
    }
}