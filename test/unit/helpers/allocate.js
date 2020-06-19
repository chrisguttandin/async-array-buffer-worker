import { allocate } from '../../../src/helpers/allocate';

describe('allocate', () => {
    after((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    describe('allocate()', () => {
        let length;

        beforeEach(() => {
            length = 412921;
        });

        it('should create an ArrayBuffer with the given length', () => {
            const arrayBuffer = allocate(length);

            expect(arrayBuffer.byteLength).to.equal(length);
        });
    });
});
