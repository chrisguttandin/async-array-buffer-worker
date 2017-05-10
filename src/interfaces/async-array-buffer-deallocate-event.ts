export interface IAsyncArrayBufferDeallocateEvent extends Event {

    data: {

        action: 'deallocate';

        arrayBuffer: ArrayBuffer;

    };

}
