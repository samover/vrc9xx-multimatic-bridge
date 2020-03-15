    _VALUES = {qm.name: qm for qm in [HOTWATER_BOOST, VENTILATION_BOOST,
                                      ONE_DAY_AWAY, SYSTEM_OFF,
                                      ONE_DAY_AT_HOME, PARTY, HOLIDAY,
                                      QUICK_VETO]}



    alexaSkill: set temperature to n degrees for ENDPOINT
        -> publish to SQS: { temperature, duration, endpoint, user }
        -> SQS -> multimaticFn?
