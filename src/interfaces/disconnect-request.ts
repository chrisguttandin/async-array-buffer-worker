export interface IDisconnectRequest {

    id: number;

    method: 'disconnect';

    params: {

        port: MessagePort;

    };

}
