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

                scope.$watch(
                    scope => scope.someValue,
                    (newValue, oldValue, scope) => {
                        oldValueGiven = oldValue;
                    }
                );

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

            it('should trigger chained watchers in the same digest', () => {
                scope.name = 'Jane';

                scope.$watch(
                    scope => scope.nameUpper,
                    (newValue, oldValue, scope) => {
                        if (newValue) {
                            scope.initial = newValue.substring(0, 1) + '.';
                        }
                    }
                );

                scope.$watch(
                    scope => scope.name,
                    (newValue, oldValue, scope) => {
                        if (newValue) {
                            scope.nameUpper = newValue.toUpperCase();
                        }
                    }
                );

                scope.$digest();
                scope.initial.should.equal('J.');

                scope.name = 'Ben';
                scope.$digest();
                scope.initial.should.equal('B.');
            });

            it('should gives up on watchers after 10 digest loops', () => {
                scope.counterA = 0;
                scope.counterB = 0;

                scope.$watch(
                    scope => scope.counterA,
                    (newValue, oldValue, scope) => {
                        scope.counterB++;
                    }
                );

                scope.$watch(
                    scope => scope.counterB,
                    (newValue, oldValue, scope) => {
                        scope.counterA++;
                    }
                );

                scope.$digest.should.throw(Error);
            });

            it('should end the digest when the last watch is clean', () => {
                scope.array = _.range(100);
                let watchExecutions = 0;

                _.times(scope.array.length, (i) => {
                    scope.$watch(
                        scope => {
                            watchExecutions++;
                            return scope.array[i]
                        },
                        (newValue, oldValue, scope) => {

                        }
                    )
                });

                scope.$digest();
                watchExecutions.should.equals(200);

                scope.array[0] = 420;
                scope.$digest();
                watchExecutions.should.equals(301);
            });

            it('should not end digest while new watchers haven\'t run', () => {
                scope.aValue = 'abc';
                scope.counter = 0;

                scope.$watch(
                    scope => scope.aValue,
                    (newValue, oldValue, scope) => {
                        scope.$watch(
                            scope => scope.aValue,
                            (newValue, oldValue, scope) => {
                                scope.counter++;
                            }
                        )
                    }
                );

                scope.$digest();
                scope.counter.should.equals(1);
            });

            it('should make comparison based on value if true flag is provided', () => {
                scope.aValue = _.range(3);
                scope.counter = 0;

                scope.$watch(
                    scope => scope.aValue,
                    (newValue, oldValue, scope) => {
                        scope.counter++;
                    },
                    true
                );

                scope.$digest();
                scope.counter.should.equals(1);

                scope.aValue.push(4);
                scope.$digest();
                scope.counter.should.equals(2);
            });

            it("should correctly handle NaNs", () => {
                scope.number = 0 / 0;
                scope.counter = 0;

                scope.$watch(
                    scope => scope.number,
                    (newValue, oldValue, scope) => {
                        scope.counter++;
                    }
                );

                scope.$digest();
                scope.counter.should.equals(1);

                scope.$digest();
                scope.counter.should.equals(1);
            });

        });

        describe('eval', () => {
            let value = Math.random();

            it('should execute $evale\'d function and returns result', () => {
                scope.aValue = value;
                let result = scope.$eval(scope => scope.aValue);
                result.should.equals(value);
            });

            it('should pass second $eval argument straight through', () => {
                scope.aValue = value;

                let result = scope.$eval((scope, arg) => {
                    return scope.aValue + arg;
                }, 2);
                result.should.equals(value + 2);
            })
        });

        describe('$apply', () => {
            let randomValue = RandomString();

            it('should execute $apply\'ed function and start the digest', () => {
                scope.aValue = randomValue;
                scope.counter = 0;

                scope.$watch(
                    scope => scope.aValue,
                    (newValue, oldValue, scope) => {
                        scope.counter++;
                    }
                );

                scope.$digest();
                scope.counter.should.equals(1);

                scope.$apply(scope => {
                    scope.aValue = RandomString;
                });

                scope.counter.should.equals(2);
            });
        });

        describe('$evalAsync', () => {
           it('should execute $evalAsync\'ed function later in the same digest', () => {
               scope.aValue = [1,2,3];
               scope.asyncEvaluated = false;
               scope.asyncEvaluatedImmediately = false;

               scope.$watch(
                   scope => scope.aValue,
                   (newValue, oldValue, scope) => {
                       scope.$evalAsync((scope) => {
                           scope.asyncEvaluated = true;
                       });
                       scope.asyncEvaluatedImmediately = scope.asyncEvaluated;
                   }
               );

               scope.$digest();
               scope.asyncEvaluated.should.be.true;
               scope.asyncEvaluatedImmediately.should.be.false;
           });
        });

    });
});
