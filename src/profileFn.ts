import { ProfileEntryPoint } from './profileFn/ProfileEntryPoint';
const entryPoint = new ProfileEntryPoint();

export const handler = entryPoint.handle.bind(entryPoint);
