import * as faker from 'faker';
import { handler } from '../../../functions/alexaSkillFn';
import { directiveFactory } from '../../../functions/alexaSkillFn/directives/directiveFactory';
import { AlexaRequestDirective, Scope } from '../../../functions/alexaSkillFn/common/interfaces/alexaEvent.interface';

jest.mock('../../../functions/alexaSkillFn/directives/directiveFactory');

describe('AlexaSkillFnHandler', () => {
    const handleStub = jest.fn();
    const event: AlexaRequestDirective = {
        directive: { header: null, endpoint: null, payload: null },
    };

    beforeEach(() => {
        // @ts-ignore
        directiveFactory.create.mockReturnValue({ handle: handleStub });
        handleStub.mockResolvedValue('response');
    });

    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());

    it('handle an alexa skill directive', async () => {
        await handler(event, null);

        expect(directiveFactory.create).toHaveBeenCalledWith(event.directive);
        expect(handleStub).toHaveBeenCalledTimes(1);
    });
    it('returns a directive response', async () => {
        await expect(handler(event, null)).resolves.toEqual('response');
    });
});
