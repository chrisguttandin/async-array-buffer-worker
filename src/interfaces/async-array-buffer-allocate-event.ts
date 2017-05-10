export interface IAsyncArrayBufferAllocateEvent extends Event {

    data: {

        action: 'allocate';

        length: number;

    };

}
