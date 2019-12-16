import { TWorkerImplementation, createWorker } from 'worker-factory';
import { allocate } from './helpers/allocate';
import { IAsyncArrayBufferWorkerCustomDefinition } from './interfaces';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

createWorker<IAsyncArrayBufferWorkerCustomDefinition>(self, <TWorkerImplementation<IAsyncArrayBufferWorkerCustomDefinition>> {
    allocate: ({ length }) => {
        const arrayBuffer = allocate(length);

        return { result: arrayBuffer, transferables: [ arrayBuffer ] };
    },
    deallocate: (/* arrayBuffer */) => {
        // Just accept the arrayBuffer.

        return { result: undefined };
    }
});
