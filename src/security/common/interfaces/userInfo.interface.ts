export interface UserInfo {
    userId: string;
    /** JMC user identifier */
    codsId: string;
    /** JMC user email */
    email: string;
    emailVerified: boolean;
    /** e.g. be_nl */
    locale: string;
    /** Has user been validated by the backoffice as a valid user? */
    isValidated: boolean;
}

