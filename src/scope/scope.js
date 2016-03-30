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

    $$digestOnce() {
        let oldValue,
            newValue,
            dirty;

        _.forEach(this.$$watchers, watcher => {
            newValue = watcher.watchFn(this);
            oldValue = watcher.last;

            if (newValue !== oldValue) {
                watcher.last = newValue;
                watcher.listenerFn(newValue, (oldValue === this._initWatchVal ? newValue : oldValue), this);
                dirty = true;
            }
        });
        return dirty;
    }

    $digest(){
        let dirty;
        do {
            dirty = this.$$digestOnce();
        } while (dirty);
    }
}