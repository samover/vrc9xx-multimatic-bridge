import { SystemApiModel } from 'vaillant-api';

export const systemApiResponse: SystemApiModel = {
  "zones": [
    {
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
    }
  ],
  "configuration": {
    "eco_mode": true,
    "holidaymode": {
      "active": false,
      "start_date": "2020-03-14",
      "end_date": "2020-03-18",
      "temperature_setpoint": 15.0
    }
  },
  "status": {
    "datetime": new Date("2020-04-19T15:41:20.000Z"),
    "outside_temperature": 17.6
  },
  "dhw": [
    {
      "hotwater": {
        "configuration": {
          "operation_mode": "AUTO",
          "temperature_setpoint": 55.0
        },
        "timeprogram": {
          "monday": [
            {
              "startTime": "00:00",
              "mode": "OFF"
            },
            {
              "startTime": "06:00",
              "mode": "ON"
            },
            {
              "startTime": "09:00",
              "mode": "OFF"
            },
            {
              "startTime": "18:00",
              "mode": "ON"
            },
            {
              "startTime": "22:30",
              "mode": "OFF"
            }
          ],
          "tuesday": [
            {
              "startTime": "00:00",
              "mode": "OFF"
            },
            {
              "startTime": "06:00",
              "mode": "ON"
            },
            {
              "startTime": "09:00",
              "mode": "OFF"
            },
            {
              "startTime": "18:00",
              "mode": "ON"
            },
            {
              "startTime": "22:30",
              "mode": "OFF"
            }
          ],
          "wednesday": [
            {
              "startTime": "00:00",
              "mode": "OFF"
            },
            {
              "startTime": "06:00",
              "mode": "ON"
            },
            {
              "startTime": "09:00",
              "mode": "OFF"
            },
            {
              "startTime": "18:00",
              "mode": "ON"
            },
            {
              "startTime": "22:30",
              "mode": "OFF"
            }
          ],
          "thursday": [
            {
              "startTime": "00:00",
              "mode": "OFF"
            },
            {
              "startTime": "06:00",
              "mode": "ON"
            },
            {
              "startTime": "09:00",
              "mode": "OFF"
            },
            {
              "startTime": "18:00",
              "mode": "ON"
            },
            {
              "startTime": "22:30",
              "mode": "OFF"
            }
          ],
          "friday": [
            {
              "startTime": "00:00",
              "mode": "OFF"
            },
            {
              "startTime": "06:00",
              "mode": "ON"
            },
            {
              "startTime": "09:00",
              "mode": "OFF"
            },
            {
              "startTime": "18:00",
              "mode": "ON"
            },
            {
              "startTime": "22:30",
              "mode": "OFF"
            }
          ],
          "saturday": [
            {
              "startTime": "00:00",
              "mode": "OFF"
            },
            {
              "startTime": "08:00",
              "mode": "ON"
            },
            {
              "startTime": "22:30",
              "mode": "OFF"
            }
          ],
          "sunday": [
            {
              "startTime": "00:00",
              "mode": "OFF"
            },
            {
              "startTime": "08:00",
              "mode": "ON"
            },
            {
              "startTime": "22:30",
              "mode": "OFF"
            }
          ]
        }
      },
      "circulation": {
        "configuration": {
          "operationMode": "AUTO"
        },
        "timeprogram": {
          "monday": [
            {
              "startTime": "00:00",
              "setting": "OFF"
            },
            {
              "startTime": "06:00",
              "setting": "ON"
            },
            {
              "startTime": "09:00",
              "setting": "OFF"
            },
            {
              "startTime": "18:00",
              "setting": "ON"
            },
            {
              "startTime": "22:30",
              "setting": "OFF"
            }
          ],
          "tuesday": [
            {
              "startTime": "00:00",
              "setting": "OFF"
            },
            {
              "startTime": "06:00",
              "setting": "ON"
            },
            {
              "startTime": "09:00",
              "setting": "OFF"
            },
            {
              "startTime": "18:00",
              "setting": "ON"
            },
            {
              "startTime": "22:30",
              "setting": "OFF"
            }
          ],
          "wednesday": [
            {
              "startTime": "00:00",
              "setting": "OFF"
            },
            {
              "startTime": "06:00",
              "setting": "ON"
            },
            {
              "startTime": "09:00",
              "setting": "OFF"
            },
            {
              "startTime": "18:00",
              "setting": "ON"
            },
            {
              "startTime": "22:30",
              "setting": "OFF"
            }
          ],
          "thursday": [
            {
              "startTime": "00:00",
              "setting": "OFF"
            },
            {
              "startTime": "06:00",
              "setting": "ON"
            },
            {
              "startTime": "09:00",
              "setting": "OFF"
            },
            {
              "startTime": "18:00",
              "setting": "ON"
            },
            {
              "startTime": "22:30",
              "setting": "OFF"
            }
          ],
          "friday": [
            {
              "startTime": "00:00",
              "setting": "OFF"
            },
            {
              "startTime": "06:00",
              "setting": "ON"
            },
            {
              "startTime": "09:00",
              "setting": "OFF"
            },
            {
              "startTime": "18:00",
              "setting": "ON"
            },
            {
              "startTime": "22:30",
              "setting": "OFF"
            }
          ],
          "saturday": [
            {
              "startTime": "00:00",
              "setting": "OFF"
            },
            {
              "startTime": "08:00",
              "setting": "ON"
            },
            {
              "startTime": "11:00",
              "setting": "OFF"
            }
          ],
          "sunday": [
            {
              "startTime": "00:00",
              "setting": "OFF"
            },
            {
              "startTime": "08:00",
              "setting": "ON"
            },
            {
              "startTime": "11:00",
              "setting": "OFF"
            }
          ]
        }
      },
      "_id": "Control_DHW"
    }
  ]
};
