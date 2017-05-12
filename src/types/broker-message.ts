import { IAllocateRequest, IDeallocateNotification } from '../interfaces';

export type TBrokerMessage = IAllocateRequest | IDeallocateNotification;
