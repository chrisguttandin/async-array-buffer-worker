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
                let remainingCycles = 10;
                let timeAtFirstCycle;

                const cycle = () => {
                    if (remainingCycles === 10) {
                        timeAtFirstCycle = performance.now();
                    }

                    if (remainingCycles === 0) {
                        millisecondsPerFrame = (performance.now() - timeAtFirstCycle) / 10;

                        done();
                    } else {
                        remainingCycles -= 1;

                        requestAnimationFrame(() => cycle());
                    }
                };

                requestAnimationFrame(() => cycle());
            }, 1000);
        });

        it('should keep on running at least at 20 frames per second', (done) => {
            let receivedBuffer = null;
            let remainingMinimalCycles = 10;
            let timeAtLastCycle = null;

            const cycle = () => {
                const now = performance.now();

                try {
                    if (timeAtLastCycle !== null) {
                        const elapsedTime = now - timeAtLastCycle;

                        expect(elapsedTime).to.be.below(millisecondsPerFrame * 3);

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
