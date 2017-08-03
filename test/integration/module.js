describe('module', () => {

    let worker;

    afterEach((done) => {
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
            this.timeout(5000);

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
                } catch (err) {
                    done(err);
                }
            };

            requestAnimationFrame(() => cycle());

            worker.addEventListener('message', ({ data }) => {
                receivedBuffer = data.result.arrayBuffer;

                expect(receivedBuffer.byteLength).to.equal(length);

                expect(data).to.deep.equal({
                    error: null,
                    id,
                    result: { arrayBuffer: receivedBuffer }
                });
            });
        });

    });

    describe('connect()', () => {

        let connectRequestId;
        let ports;

        beforeEach(() => {
            connectRequestId = 823;

            const messageChannel = new MessageChannel();

            ports = [ messageChannel.port1, messageChannel.port2 ];
        });

        it('should connect a port', function (done) {
            this.timeout(6000);

            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({
                    error: null,
                    id: connectRequestId,
                    result: null
                });

                done();
            });

            worker.postMessage({
                id: connectRequestId,
                method: 'connect',
                params: { port: ports[0] }
            }, [
                ports[0]
            ]);
        });

        it('should communicate via a connected port', function (done) {
            this.timeout(6000);

            const allocateRequestId = 1982;
            const length = 178;

            ports[1].start();
            ports[1].addEventListener('message', ({ data }) => {
                const receivedBuffer = data.result.arrayBuffer;

                expect(receivedBuffer.byteLength).to.equal(length);

                expect(data).to.deep.equal({
                    error: null,
                    id: allocateRequestId,
                    result: { arrayBuffer: receivedBuffer }
                });

                done();
            });

            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({
                    error: null,
                    id: connectRequestId,
                    result: null
                });

                ports[1].postMessage({
                    id: allocateRequestId,
                    method: 'allocate',
                    params: { length }
                });
            });

            worker.postMessage({
                id: connectRequestId,
                method: 'connect',
                params: { port: ports[0] }
            }, [
                ports[0]
            ]);
        });

    });

    describe('disconnect()', () => {

        let disconnectRequestId;
        let ports;

        beforeEach(() => {
            disconnectRequestId = 823;

            const messageChannel = new MessageChannel();

            ports = [ messageChannel.port1, messageChannel.port2 ];
        });

        it('should disconnect a port', function (done) {
            this.timeout(6000);

            worker.addEventListener('message', ({ data }) => {
                expect(data).to.deep.equal({
                    error: null,
                    id: disconnectRequestId,
                    result: null
                });

                done();
            });

            worker.postMessage({
                id: disconnectRequestId,
                method: 'disconnect',
                params: { port: ports[0] }
            }, [
                ports[0]
            ]);
        });

    });

});
