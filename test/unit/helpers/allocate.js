import { allocate } from '../../../src/helpers/allocate';

describe('allocate', () => {

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
