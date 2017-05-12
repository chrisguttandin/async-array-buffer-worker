import { IAllocateResponse, IErrorNotification, IErrorResponse } from '../interfaces';

export type TWorkerMessage = IAllocateResponse | IErrorNotification | IErrorResponse;
