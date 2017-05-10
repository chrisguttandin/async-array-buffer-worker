describe('module', () => {

    let worker;

    beforeEach(() => {
        worker = new Worker('base/src/module.ts');
    });

    describe('allocate()', () => {

        let length;

        beforeEach((done) => {
            length = 2147479551;

            // Wait some time to allow the browser to warm up.
            setTimeout(done, 1000);
        });

        it('should keep on running at least at 20 frames per second', (done) => {
            let receivedBuffer = null;
            let remainingMinimalCycles = 10;
            let timeAtLastCycle = null;

            const budget = (1000 / 20);

            const cycle = () => {
                const now = performance.now();

                try {
                    if (timeAtLastCycle !== null) {
                        const elapsedTime = now - timeAtLastCycle;

                        expect(elapsedTime).to.be.below(budget);

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
