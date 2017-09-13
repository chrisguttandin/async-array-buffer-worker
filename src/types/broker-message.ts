import { IAllocateRequest, IConnectRequest, IDeallocateNotification, IDisconnectRequest } from '../interfaces';

export type TBrokerMessage = IAllocateRequest | IConnectRequest | IDeallocateNotification | IDisconnectRequest;
