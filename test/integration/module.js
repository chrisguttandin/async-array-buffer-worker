describe('module', () => {

    let worker;

    after((done) => {
        // @todo This is a optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    beforeEach(() => {
        worker = new Worker('base/src/module.ts');
    });

    describe('allocate()', () => {

        let id;
        let length;
        let millisecondsPerFrame;

        beforeEach(function (done) {
            this.timeout(10000);

            id = 33;
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
            this.timeout(20000);

            let receivedBuffer = null;
            let remainingMinimalCycles = 50;
            let timeOneCycleAgo = null;
            let timeTwoCyclesAgo = null;

            const cycle = () => {
                const now = performance.now();

                try {
                    if (timeTwoCyclesAgo !== null) {
                        // Compute the time that elapsed during the last two cycles.
                        const elapsedTime = now - timeTwoCyclesAgo;

                        // Allow the frame to be ten times as long as an average frame.
                        expect(elapsedTime).to.be.below(millisecondsPerFrame * 2 * 10);

                        remainingMinimalCycles -= 1;

                        if (remainingMinimalCycles === 7) {
                            worker.postMessage({ id, method: 'allocate', params: { length } });
                        } else if (receivedBuffer !== null && remainingMinimalCycles <= 0) {
                            done();
                        }
                    }

                    timeTwoCyclesAgo = timeOneCycleAgo;
                    timeOneCycleAgo = now;

                    requestAnimationFrame(() => cycle());
                } catch (err) {
                    done(err);
                }
            };

            requestAnimationFrame(() => cycle());

            worker.addEventListener('message', ({ data }) => {
                receivedBuffer = data.result;

                expect(receivedBuffer.byteLength).to.equal(length);

                expect(data).to.deep.equal({
                    id,
                    result: receivedBuffer
                });
            });
        });

    });

    describe('deallocate()', () => {

        let arrayBuffer;

        beforeEach(() => {
            arrayBuffer = new ArrayBuffer(23);
        });

        it('should not send a response', function (done) {
            this.timeout(6000);

            worker.addEventListener('message', () => {
                done(new Error('This should never be called.'));
            });

            worker.postMessage({
                id: null,
                method: 'deallocate',
                params: { arrayBuffer }
            }, [
                arrayBuffer
            ]);

            // Wait some time to be sure that there is no response coming back from the worker.
            setTimeout(done, 2000);
        });

    });

});
