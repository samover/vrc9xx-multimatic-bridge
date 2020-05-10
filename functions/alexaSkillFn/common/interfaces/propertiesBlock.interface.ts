export interface PropertiesBlock {
    namespace: string;
    instance?: string;
    name: string;
    value: string | { value: string | number; scale?: string };
    timeOfSample: string;
    uncertaintyInMilliseconds: number;
}

