import { MultimaticEntryPoint } from './multimaticFn/MultimaticEntryPoint';

const entryPoint = new MultimaticEntryPoint();

export const handler = entryPoint.handle.bind(entryPoint);
