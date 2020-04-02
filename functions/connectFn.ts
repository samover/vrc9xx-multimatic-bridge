import { ConnectEntryPoint } from './connectFn/ConnectEntryPoint';

const entryPoint = new ConnectEntryPoint();

export const handler = entryPoint.handle.bind(entryPoint);
