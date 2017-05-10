import { allocate } from './helpers/allocate';
import { TAsyncArrayBufferEvent } from './types';

export * from './interfaces';
export * from './types';

addEventListener('message', ({ data }: TAsyncArrayBufferEvent) => {
    try {
        if (data.action === 'allocate') {
            const arrayBuffer = allocate(data.length);

            postMessage({ arrayBuffer }, [ arrayBuffer ]);
        } else if (data.action === 'deallocate') {
            // Just accept the incoming event.
        }
    } catch (err) {
        postMessage({ err: { message: err.message } });
    }
});
