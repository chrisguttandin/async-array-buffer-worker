import { allocate } from './helpers/allocate';
import { IAllocateResponse, IBrokerEvent, IConnectResponse, IDisconnectResponse, IErrorNotification, IErrorResponse } from './interfaces';

export * from './interfaces';
export * from './types';

const handleEvent = (receiver: MessagePort, { data }: IBrokerEvent) => {
    try {
        if (data.method === 'allocate') {
            const { id, params: { length } } = data;

            const arrayBuffer = allocate(length);

            receiver.postMessage(<IAllocateResponse> {
                error: null,
                id,
                result: { arrayBuffer }
            }, [ arrayBuffer ]);
        } else if (data.method === 'connect') {
            const { id, params: { port } } = data;

            port.start();
            port.addEventListener('message', handleEvent.bind(null, port));

            receiver.postMessage(<IConnectResponse> { error: null, id, result: null });
        } else if (data.method === 'deallocate') {
            // Just accept the incoming event.
        } else if (data.method === 'disconnect') {
            const { id, params: { port } } = data;

            port.close();

            receiver.postMessage(<IDisconnectResponse> { error: null, id, result: null });
        }
    } catch (err) {
        receiver.postMessage(<IErrorNotification | IErrorResponse> {
            error: {
                message: err.message
            },
            id: data.id,
            result: null
        });
    }
};

addEventListener('message', handleEvent.bind(null, self));
