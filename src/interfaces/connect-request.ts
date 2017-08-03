export interface IConnectRequest {

    id: number;

    method: 'connect';

    params: {

        port: MessagePort;

    };

}
