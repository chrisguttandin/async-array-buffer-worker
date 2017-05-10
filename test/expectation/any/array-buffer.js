describe('ArrayBuffer', () => {

    describe('constructor()', () => {

        let length;

        beforeEach((done) => {
            length = 2147479551;

            // Wait some time to allow the browser to warm up.
            setTimeout(done, 1000);
        });

        it('should block the main thread', function (done) {
            this.timeout(5000);

            let arrayBuffer; // eslint-disable-line no-unused-vars
            let remainingMinimalCycles = 10;
            let timeAtLastCycle = null;

            const budget = (1000 / 20);

            const cycle = () => {
                const now = performance.now();

                try {
                    if (timeAtLastCycle !== null) {
                        const elapsedTime = now - timeAtLastCycle;

                        if (remainingMinimalCycles === 7) {
                            expect(elapsedTime).to.be.above(budget);
                        } else {
                            expect(elapsedTime).to.be.below(budget);
                        }

                        remainingMinimalCycles -= 1;

                        if (remainingMinimalCycles === 7) {
                            // Keep a reference until the test is over to avoid garbage collection.
                            arrayBuffer = new ArrayBuffer(length);
                        } else if (remainingMinimalCycles === 0) {
                            done();
                        }
                    }

                    timeAtLastCycle = now;

                    requestAnimationFrame(() => cycle());
                } catch (err) {
                    done(err);
                }
            };

            requestAnimationFrame(() => cycle());
        });

    });

});
