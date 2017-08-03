import { TBrokerMessage } from '../types';

export interface IBrokerEvent extends MessageEvent {

    data: TBrokerMessage;

}
