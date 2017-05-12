export interface IAllocateRequest {

    id: number;

    method: 'allocate';

    params: {

        length: number;

    };

}
