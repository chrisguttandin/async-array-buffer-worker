describe('module', () => {

    let millisecondsPerFrame;
    let worker;

    beforeEach(() => {
        worker = new Worker('base/src/module.ts');
    });

    describe('allocate()', () => {

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

        it('should not block the main thread', function (done) {
            this.timeout(5000);

            let receivedBuffer = null;
            let remainingMinimalCycles = 10;
            let timeAtLastCycle = null;

            const cycle = () => {
                const now = performance.now();

                try {
                    if (timeAtLastCycle !== null) {
                        const elapsedTime = now - timeAtLastCycle;

                        expect(elapsedTime).to.be.below(millisecondsPerFrame * 10);

                        remainingMinimalCycles -= 1;

                        if (remainingMinimalCycles === 7) {
                            worker.postMessage({ action: 'allocate', length });
                        } else if (receivedBuffer !== null && remainingMinimalCycles <= 0) {
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

            worker.addEventListener('message', ({ data: { arrayBuffer } }) => {
                expect(arrayBuffer.byteLength).to.equal(length);

                receivedBuffer = arrayBuffer;
            });
        });

    });

});
