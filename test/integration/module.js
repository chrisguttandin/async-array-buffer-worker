describe('module', () => {

    let worker;

    after((done) => {
        // @todo This is an optimistic fix to prevent the famous 'Some of your tests did a full page reload!' error.
        setTimeout(done, 1000);
    });

    beforeEach(() => {
        worker = new Worker('base/src/module.js');
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

                const cycle = (now) => {
                    if (remainingCycles === numberOfCycles) {
                        timeAtFirstCycle = now;
                    }

                    if (remainingCycles === 0) {
                        millisecondsPerFrame = (now - timeAtFirstCycle) / numberOfCycles;

                        done();
                    } else {
                        remainingCycles -= 1;

                        requestAnimationFrame(cycle);
                    }
                };

                requestAnimationFrame(cycle);
            }, 1000);
        });

        it('should not block the main thread', function (done) {
            this.timeout(20000);

            let receivedBuffer = null;
            let remainingMinimalCycles = 50;
            let timeOneCycleAgo = null;

            const cycle = (now) => {
                try {
                    if (timeOneCycleAgo !== null) {
                        const elapsedTime = now - timeOneCycleAgo;

                        // Allow the frame to be three times as long as an average frame.
                        expect(elapsedTime).to.be.below(millisecondsPerFrame * 3);

                        remainingMinimalCycles -= 1;

                        if (remainingMinimalCycles === 7) {
                            worker.postMessage({ id, method: 'allocate', params: { length } });
                        } else if (receivedBuffer !== null && remainingMinimalCycles <= 0) {
                            done();
                        }
                    }

                    timeOneCycleAgo = now;

                    requestAnimationFrame(cycle);
                } catch (err) {
                    done(err);
                }
            };

            requestAnimationFrame(cycle);

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
