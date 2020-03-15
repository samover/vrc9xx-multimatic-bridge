import {ContextProperty} from "./alexaEvent.interface";

export interface PropertiesBuilder {
    build: (model: any) => ContextProperty[];
}
