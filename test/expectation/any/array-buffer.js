describe('ArrayBuffer', () => {

    describe('constructor()', () => {

        let length;

        beforeEach(() => {
            length = 2147479551;
        });

        it('should block the main thread', function () {
            this.timeout(10000);

            let lastNow = performance.now();
            let currentNow = performance.now();

            expect(currentNow - lastNow).to.be.below(100);

            new ArrayBuffer(length);

            lastNow = currentNow;
            currentNow = performance.now();

            expect(currentNow - lastNow).to.be.above(100);
        });

    });

});
