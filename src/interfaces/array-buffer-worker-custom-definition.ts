import { IWorkerDefinition } from 'worker-factory';

export interface IArrayBufferWorkerCustomDefinition extends IWorkerDefinition {

    allocate: {

        params: {

            length: number;

        };

        response: {

            result: ArrayBuffer;

            transferables: [ ArrayBuffer ];

        };

    };

    deallocate: {

        params: {

            arrayBuffer: ArrayBuffer;

        };

        response: {

            result: void;

        };

    };

}
