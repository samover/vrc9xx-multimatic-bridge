import { SSM } from 'aws-sdk';

class ParameterStore {
    private SSMService: SSM = new SSM();

    private publicKeyName: string = `profilegate-public-key-${process.env.ENVIRONMENT}`;
    private privateKeyName: string = `profilegate-private-key-${process.env.ENVIRONMENT}`;
    private publicKey: string;
    private privateKey: string;

    public async getPublicKey() {
        if (this.publicKey) { return this.publicKey }
        const value = await this.SSMService.getParameter({
            Name: this.publicKeyName,
            WithDecryption: true,
        }).promise();

        this.publicKey = value && value.Parameter && value.Parameter.Value;
        return this.publicKey;
    }

    public async getPrivateKey() {
        if (this.privateKey) { return this.privateKey }
        const value = await this.SSMService.getParameter({
            Name: this.privateKeyName,
            WithDecryption: true,
        }).promise();

        this.privateKey = value && value.Parameter && value.Parameter.Value;
        return this.privateKey;
    }
}

export const parameterStore = new ParameterStore();
