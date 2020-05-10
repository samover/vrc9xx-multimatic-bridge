import { ZoneApiModel } from 'vaillant-api';

export const zoneApiResponse: ZoneApiModel = {
  "heating": {
    "configuration": {
      "mode": "DAY",
      "setback_temperature": 17.5,
      "setpoint_temperature": 21.0
    },
    "timeprogram": {
      "monday": [
        {
          "startTime": "00:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "06:00",
          "setting": "DAY"
        },
        {
          "startTime": "09:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "18:00",
          "setting": "DAY"
        },
        {
          "startTime": "21:00",
          "setting": "NIGHT"
        }
      ],
      "tuesday": [
        {
          "startTime": "00:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "06:00",
          "setting": "DAY"
        },
        {
          "startTime": "09:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "18:00",
          "setting": "DAY"
        },
        {
          "startTime": "21:00",
          "setting": "NIGHT"
        }
      ],
      "wednesday": [
        {
          "startTime": "00:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "06:00",
          "setting": "DAY"
        },
        {
          "startTime": "09:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "18:00",
          "setting": "DAY"
        },
        {
          "startTime": "21:00",
          "setting": "NIGHT"
        }
      ],
      "thursday": [
        {
          "startTime": "00:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "06:00",
          "setting": "DAY"
        },
        {
          "startTime": "09:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "18:00",
          "setting": "DAY"
        },
        {
          "startTime": "21:00",
          "setting": "NIGHT"
        }
      ],
      "friday": [
        {
          "startTime": "00:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "06:00",
          "setting": "DAY"
        },
        {
          "startTime": "09:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "18:00",
          "setting": "DAY"
        },
        {
          "startTime": "21:00",
          "setting": "NIGHT"
        }
      ],
      "saturday": [
        {
          "startTime": "00:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "08:00",
          "setting": "DAY"
        },
        {
          "startTime": "23:00",
          "setting": "NIGHT"
        }
      ],
      "sunday": [
        {
          "startTime": "00:00",
          "setting": "NIGHT"
        },
        {
          "startTime": "08:00",
          "setting": "DAY"
        },
        {
          "startTime": "23:00",
          "setting": "NIGHT"
        }
      ]
    }
  },
  "configuration": {
    "name": "HOME      ",
    "enabled": true,
    "active_function": "HEATING",
    "inside_temperature": 21.9,
    "quick_veto": {
      "active": false,
      "setpoint_temperature": 21.5
    }
  },
  "currently_controlled_by": {
    "name": "RBR",
  },
  "_id": "Control_ZO1"
};
