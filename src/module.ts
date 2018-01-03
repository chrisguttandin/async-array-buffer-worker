import { createWorker } from 'worker-factory';
import { allocate } from './helpers/allocate';
import { IArrayBufferWorkerCustomDefinition } from './interfaces';

export * from './interfaces';
export * from './types';

createWorker<IArrayBufferWorkerCustomDefinition>(self, {
    allocate: ({ length }) => {
        const arrayBuffer = allocate(length);

        return { result: arrayBuffer, transferables: [ arrayBuffer ] };
    },
    deallocate: (/* arrayBuffer */) => {
        // Just accept the arrayBuffer.

        return { result: undefined };
    }
});
