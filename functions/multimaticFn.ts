import { MultimaticController } from './multimaticFn/MultimaticController';
const entryPoint = new MultimaticController();

export const handler = entryPoint.handle.bind(entryPoint);
