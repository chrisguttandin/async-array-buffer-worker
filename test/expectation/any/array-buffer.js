describe('ArrayBuffer', () => {

    describe('constructor()', () => {

        let length;

        after((done) => {
            // @todo This is a optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
            setTimeout(done, 1000);
        });

        beforeEach(() => {
            /*
             * 2147479551 is the largest possible length but an ArrayBuffer of that size can't be used by Chrome and Safari on
             * Sauce Labs. However a size of 200,000,000 bytes is enough to let the test pass.
             */
            length = 200000000;
        });

        it('should block the main thread', function () {
            this.timeout(10000);

            let lastNow = performance.now();
            let currentNow = performance.now();

            expect(currentNow - lastNow).to.be.below(50);

            new ArrayBuffer(length);

            lastNow = currentNow;
            currentNow = performance.now();

            expect(currentNow - lastNow).to.be.above(50);
        });

    });

});
