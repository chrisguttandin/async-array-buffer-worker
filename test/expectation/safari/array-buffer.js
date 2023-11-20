describe('ArrayBuffer', () => {
    describe('constructor()', () => {
        let length;

        beforeEach(() => {
            /*
             * 2147479551 is the largest possible length but an ArrayBuffer of that size can't be used by Chrome and Safari on
             * Sauce Labs. However a size of 400,000,000 bytes is enough to let the test pass.
             */
            length = 400000000;
        });

        it('should block the main thread', function () {
            this.timeout(10000);

            let lastNow = performance.now();
            let currentNow = performance.now();

            expect(currentNow - lastNow).to.be.below(30);

            lastNow = performance.now();

            new ArrayBuffer(length);

            currentNow = performance.now();

            expect(currentNow - lastNow).to.be.above(30);

            lastNow = performance.now();
            currentNow = performance.now();

            expect(currentNow - lastNow).to.be.below(30);
        });
    });
});
