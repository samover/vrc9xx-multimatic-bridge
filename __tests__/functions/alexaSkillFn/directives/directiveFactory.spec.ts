import { NAMESPACES } from '../../../../functions/alexaSkillFn/common/constants/alexaEvent.constants';
import { AlexaDirective } from '../../../../functions/alexaSkillFn/directives/AlexaDirective';
import { AlexaDiscoveryDirective } from '../../../../functions/alexaSkillFn/directives/AlexaDiscoveryDirective';
import { AlexaThermostatControlDirective } from '../../../../functions/alexaSkillFn/directives/AlexaThermostatControlDirective';
import { directiveFactory } from '../../../../functions/alexaSkillFn/directives/directiveFactory';

describe('directiveFactory', () => {
    it('creates an alexaDirective', () => {
        // @ts-ignore
        expect(directiveFactory.create({ header: { namespace: NAMESPACES.Alexa }}))
            .toBeInstanceOf(AlexaDirective);
    });
    it('creates an AlexaDiscoveryDirective', () => {
        // @ts-ignore
        expect(directiveFactory.create({ header: { namespace: NAMESPACES.AlexaDiscovery }}))
            .toBeInstanceOf(AlexaDiscoveryDirective);
    });
    it('creates an AlexaThermostatControlDirective', () => {
        // @ts-ignore
        expect(directiveFactory.create({ header: { namespace: NAMESPACES.AlexaThermostatController }}))
            .toBeInstanceOf(AlexaThermostatControlDirective);
    });
    it('creates an AlexaDirective by default', () => {
        // @ts-ignore
        expect(directiveFactory.create({ header: { namespace: NAMESPACES.AlexaControl }}))
            .toBeInstanceOf(AlexaDirective);
    });
});
