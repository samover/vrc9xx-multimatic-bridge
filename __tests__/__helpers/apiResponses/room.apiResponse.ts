import { RoomApiModel } from 'vaillant-api';

export const roomApiResponse: RoomApiModel = {
  "roomIndex": 3,
  "configuration": {
    "name": "Living Room",
    "temperatureSetpoint": 21.0,
    "operationMode": "AUTO",
    "currentTemperature": 22.8,
    "childLock": false,
    "isWindowOpen": false,
    "devices": [
      {
        "name": "Living room_2",
        "sgtin": "3014F59C28000A19B0001CA9",
        "deviceType": "VALVE",
        "isBatteryLow": false,
        "isRadioOutOfReach": false
      },
      {
        "name": "Living room_1",
        "sgtin": "3014F59C28000A19B0001CA5",
        "deviceType": "VALVE",
        "isBatteryLow": false,
        "isRadioOutOfReach": false
      },
      {
        "name": "Living room_3",
        "sgtin": "3014F59C28000A19B0001AAE",
        "deviceType": "VALVE",
        "isBatteryLow": false,
        "isRadioOutOfReach": false
      }
    ],
    "iconId": "LIVING_ROOM"
  },
  "timeprogram": {
    "monday": [
      {
        "startTime": "00:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "06:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "09:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "17:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "22:00",
        "temperatureSetpoint": 17.0
      }
    ],
    "tuesday": [
      {
        "startTime": "00:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "06:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "09:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "17:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "22:00",
        "temperatureSetpoint": 17.0
      }
    ],
    "wednesday": [
      {
        "startTime": "00:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "06:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "09:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "17:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "22:00",
        "temperatureSetpoint": 17.0
      }
    ],
    "thursday": [
      {
        "startTime": "00:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "06:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "09:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "17:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "22:00",
        "temperatureSetpoint": 17.0
      }
    ],
    "friday": [
      {
        "startTime": "00:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "06:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "09:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "17:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "22:00",
        "temperatureSetpoint": 17.0
      }
    ],
    "saturday": [
      {
        "startTime": "00:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "06:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "23:00",
        "temperatureSetpoint": 17.0
      }
    ],
    "sunday": [
      {
        "startTime": "00:00",
        "temperatureSetpoint": 17.0
      },
      {
        "startTime": "06:00",
        "temperatureSetpoint": 21.0
      },
      {
        "startTime": "23:00",
        "temperatureSetpoint": 17.0
      }
    ]
  }
};
