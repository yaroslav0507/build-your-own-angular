'use strict';
import _ from 'lodash';

export default class Scope {
    constructor() {
        this.$$watchers = [];
        this.$$lastDirtyWatch = null;
        this.$$asyncQueue = [];
    }

    _initWatchVal(){}

    $eval(expr, locals){
        return expr(this, locals)
    }

    $evalAsync(expr){
        this.$$asyncQueue.push({
            scope: this,
            expression: expr
        });
    }

    $apply(expr){
        try {
            return this.$eval(expr);
        } finally {
            this.$digest();
        }
    }

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
            return newValue === oldValue ||
                (typeof newValue === 'number' && typeof oldValue === 'number' &&
                isNaN(newValue) && isNaN(oldValue));
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
            while(this.$$asyncQueue.length){
                let asyncTask = this.$$asyncQueue.shift();
                asyncTask.scope.$eval(asyncTask.expression);
            }

            dirty = this.$$digestOnce();
            if((dirty || this.$$asyncQueue.length) && !(TTL--)){
                throw new Error('10 digest iterations reached');
            }
        } while (dirty || this.$$asyncQueue.length);
    }
}