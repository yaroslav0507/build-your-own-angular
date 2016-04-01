'use strict';
import _ from 'lodash';

export default class Scope {
    constructor() {
        this.$$watchers = [];
        this.$$lastDirtyWatch = null;
    }

    _initWatchVal(){}


    $watch(watchFn, listenerFn, valueEqFlag) {
        let watcher = {
            watchFn: watchFn,
            listenerFn: listenerFn || function(){},
            valueEqFlag: !!valueEqFlag,
            last: this._initWatchVal
        };
        this.$$watchers.push(watcher);
        this.$$lastDirtyWatch = null;
    }

    $$areEqual(newValue, oldValue, valueEqFlag) {
        if(valueEqFlag) {
            return _.isEqual(newValue, oldValue);
        } else {
            return newValue === oldValue;
        }
    }

    $$digestOnce() {
        let oldValue, newValue, dirty;

        _.forEach(this.$$watchers, watcher => {
            newValue = watcher.watchFn(this);
            oldValue = watcher.last;

            if (!this.$$areEqual(newValue, oldValue, watcher.valueEqFlag)) {
                this.$$lastDirtyWatch = watcher;
                watcher.last = (watcher.valueEqFlag ? _.cloneDeep(newValue) : newValue);
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