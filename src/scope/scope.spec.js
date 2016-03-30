import Scope from './scope';

describe('Scope', () => {
    let scope;

    it('can be created and used as an object', () => {
        scope = new Scope();
        scope.should.be.an.object;
    });

    describe('digest', () => {
        beforeEach(() => {
           scope = new Scope();
        });

        it('should call a listener function on first $digest', () => {
            let watchFn = env.stub();
            let listenerFn = env.stub();

            scope.$watch(watchFn, listenerFn);
            scope.$digest();

            listenerFn.should.have.been.called;
        });

        it('should call whe watch function with the scope as the argument', () => {
            let watchFn = env.stub();
            let listenerFn = env.stub();

            scope.$watch(watchFn, listenerFn);
            scope.$digest();

            watchFn.should.have.been.calledWith(scope);
        });

        describe('scope listeners', () => {
            let watchFunc,
                listenerFunc;

            beforeEach(() => {
                scope.someValue = RandomString();
                scope.counter = 0;

                watchFunc = scope => (scope.someValue);
                listenerFunc = (newValue, oldValue, scope) => {
                    scope.counter++;
                };
            });

            it('should call listener function only when watched value is changed', () => {
                scope.$watch(watchFunc, listenerFunc);

                scope.counter.should.equal(0);

                scope.$digest();
                scope.counter.should.equal(1);

                scope.$digest();
                scope.counter.should.equal(1);

                scope.someValue = RandomString();
                scope.counter.should.equal(1);

                scope.$digest();
                scope.counter.should.equal(2);
            });

            it('should call listener when initial watch value is undefined', () => {
                scope.$watch(watchFunc, listenerFunc);
                scope.$digest();

                scope.counter.should.equal(1);
            });

            it('should call listener with new value as old one the first time', () => {
                scope.someValue = 123;
                let oldValueGiven;

                watchFunc = scope => (scope.someValue);
                listenerFunc = (newValue, oldValue, scope) => {
                    oldValueGiven = oldValue;
                };
                scope.$watch(watchFunc, listenerFunc);
                scope.$digest();
                oldValueGiven.should.equal(123);
            });

            it('should have watchers that omit the listener function', () => {
                let wathcerReturnValue = RandomString();
                let watchFn = env.stub().returns(wathcerReturnValue);

                scope.$watch(watchFn);
                scope.$digest();
                watchFn.should.have.been.called;
            });
        });

    });
});
