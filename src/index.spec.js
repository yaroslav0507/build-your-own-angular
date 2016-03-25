import { sayHello } from './';

describe('index', () => {
    describe('hello', () => {
        it('should say hello to receiver', () => {
            sayHello('World').should.equal('Hello, World');
        });
    })
});
