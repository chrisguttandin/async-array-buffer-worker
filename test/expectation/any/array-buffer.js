describe('ArrayBuffer', () => {

    describe('constructor()', () => {

        let millisecondsPerFrame;
        let length;

        beforeEach(function (done) {
            this.timeout(5000);

            length = 2147479551;

            // Wait some time to allow the browser to warm up.
            setTimeout(() => {
                const numberOfCycles = 50;

                let remainingCycles = numberOfCycles;
                let timeAtFirstCycle;

                const cycle = () => {
                    if (remainingCycles === numberOfCycles) {
                        timeAtFirstCycle = performance.now();
                    }

                    if (remainingCycles === 0) {
                        millisecondsPerFrame = (performance.now() - timeAtFirstCycle) / numberOfCycles;

                        done();
                    } else {
                        remainingCycles -= 1;

                        requestAnimationFrame(() => cycle());
                    }
                };

                requestAnimationFrame(() => cycle());
            }, 1000);
        });

        it('should block the main thread', function (done) {
            this.timeout(5000);

            let arrayBuffer; // eslint-disable-line no-unused-vars
            let remainingMinimalCycles = 10;
            let timeAtLastCycle = null;

            const cycle = () => {
                const now = performance.now();

                try {
                    if (timeAtLastCycle !== null) {
                        const elapsedTime = now - timeAtLastCycle;

                        if (remainingMinimalCycles === 7) {
                            expect(elapsedTime).to.be.above(millisecondsPerFrame / 3);
                        } else {
                            expect(elapsedTime).to.be.below(millisecondsPerFrame * 3);
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
