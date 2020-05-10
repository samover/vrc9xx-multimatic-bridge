import * as faker from 'faker';
import {
    RoomModel, SystemModel, SystemOverrideEnum, SystemStatusModel, ZoneModel,
} from 'models';

const getTemperature = (): number => faker.random.number({ min: 18, max: 30, precision: 1 });

export const roomModel = ({
    build: (): RoomModel => ({
        id: faker.random.number(),
        facilityId: faker.random.uuid(),
        name: faker.lorem.word(),
        temperatureSetpoint: getTemperature(),
        operationMode: faker.random.arrayElement(['AUTO', 'OFF', 'ECO']),
        currentTemperature: getTemperature(),
        childLock: faker.random.boolean(),
        isWindowOpen: faker.random.boolean(),
    }),
});

export const zoneModel = ({
    build: (): ZoneModel => ({
        id: faker.random.uuid(),
        facilityId: faker.random.uuid(),
        name: faker.lorem.word(),
        temperatureSetpoint: getTemperature(),
        insideTemperature: getTemperature(),
        mode: faker.random.arrayElement(['DAY', 'NIGHT']),
        enabled: faker.random.boolean(),
    }),
});

export const systemStatusModel = ({
    build: (): SystemStatusModel => ({
        id: faker.random.uuid(),
        outsideTemperature: getTemperature(),
        datetime: new Date(),
        systemOverride: faker.random.arrayElement(Object.values(SystemOverrideEnum)),
        ecoMode: faker.random.boolean(),
        holidayMode: {
            active: faker.random.boolean(),
            start: new Date().toISOString(),
            end: new Date().toISOString(),
            temperatureSetpoint: getTemperature(),
        },
    }),
});

export const systemModel = ({
    build: (): SystemModel => ({
        ...systemStatusModel.build(),
        name: faker.lorem.word(),
        manufacturer: faker.lorem.word(),
        controller: faker.lorem.word(),
        rooms: [roomModel.build(), roomModel.build()],
        zones: [zoneModel.build(), zoneModel.build()],
        dhw: [],
    }),
});
