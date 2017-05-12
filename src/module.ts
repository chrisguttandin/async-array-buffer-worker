import { allocate } from './helpers/allocate';
import { IAllocateResponse, IBrokerEvent, IErrorNotification, IErrorResponse } from './interfaces';

export * from './interfaces';
export * from './types';

addEventListener('message', ({ data }: IBrokerEvent) => {
    try {
        if (data.method === 'allocate') {
            const { id, params: { length } } = data;

            const arrayBuffer = allocate(length);

            postMessage(<IAllocateResponse> {
                error: null,
                id,
                result: { arrayBuffer }
            }, [ arrayBuffer ]);
        } else if (data.method === 'deallocate') {
            // Just accept the incoming event.
        }
    } catch (err) {
        postMessage(<IErrorNotification | IErrorResponse> {
            error: {
                message: err.message
            },
            id: data.id,
            result: null
        });
    }
});
