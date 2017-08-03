import { IAllocateResponse, IConnectResponse, IDisconnectResponse, IErrorNotification, IErrorResponse } from '../interfaces';

export type TWorkerMessage = IAllocateResponse | IConnectResponse | IDisconnectResponse | IErrorNotification | IErrorResponse;
