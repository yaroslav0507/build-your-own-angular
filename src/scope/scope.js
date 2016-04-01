'use strict';
import _ from 'lodash';

export default class Scope {
    constructor() {
        this.$$watchers = [];
        this.$$lastDirtyWatch = null;
    }

    _initWatchVal(){}

    $watch(watchFn, listenerFn) {
        let watcher = {
            watchFn: watchFn,
            listenerFn: listenerFn || function(){},
            last: this._initWatchVal
        };
        this.$$watchers.push(watcher);
        this.$$lastDirtyWatch = null;
    }

    $$digestOnce() {
        let oldValue,
            newValue,
            dirty;

        _.forEach(this.$$watchers, watcher => {
            newValue = watcher.watchFn(this);
            oldValue = watcher.last;

            if (newValue !== oldValue) {
                this.$$lastDirtyWatch = watcher;
                watcher.last = newValue;
                watcher.listenerFn(newValue, (oldValue === this._initWatchVal ? newValue : oldValue), this);
                dirty = true;
            } else if (this.$$lastDirtyWatch === watcher) {
                return false;
            }
        });
        return dirty;
    }

    $digest(){
        let TTL = 10;
        let dirty;
        this.$$lastDirtyWatch = null;

        do {
            dirty = this.$$digestOnce();
            if(dirty && !(TTL--)){
                throw new Error('10 digest iterations reached');
            }
        } while (dirty);
    }
}