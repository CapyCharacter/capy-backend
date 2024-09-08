export function envKeyIsInvalidOrMissing(keyName: string): never {
    throw new Error(`Environment variable ${keyName} is invalid or missing.`);
}

export enum NumberEnvRequirement {
    NONE,
    MUST_BE_POSITIVE,
    MUST_BE_POSITIVE_OR_ZERO,
};

export function readNumberEnv(keyName: string, requirement: NumberEnvRequirement): number {
    const validate = (): number|null => {
        const N = +(process.env[keyName] || NaN);

        if (isNaN(N)) return null;
        if (!isFinite(N)) return null;
    
        switch (requirement) {
            case NumberEnvRequirement.MUST_BE_POSITIVE:
                if (N <= 0) return null;
            
            case NumberEnvRequirement.MUST_BE_POSITIVE_OR_ZERO:
                if (N < 0) return null;
        }

        return N;
    };

    const N = validate();
    if (N === null) envKeyIsInvalidOrMissing(keyName);
    return N;
}

export function readBooleanEnv(keyName: string): boolean {
    const valueAsString = process.env[keyName];

    if (undefined === valueAsString) envKeyIsInvalidOrMissing(keyName);

    switch (valueAsString) {
        case 'true':
            return true;
        
        case 'false':
            return false;
        
        default:
            envKeyIsInvalidOrMissing(keyName);
    }
}

export function readNonEmptyStringEnv(keyName: string): string {
    return process.env[keyName] || envKeyIsInvalidOrMissing(keyName);
}

export function readOptionalStringEnv(keyName: string): string|null {
    return process.env[keyName] || null;
}

export function readStringListEnv(keyName: string, { ignoreEmptySegments } : {
    ignoreEmptySegments: boolean,
}): string[] {
    const rawString = readNonEmptyStringEnv(keyName);

    let stringList = rawString.split(',');

    if (ignoreEmptySegments) {
        stringList = stringList.filter(s => s.length > 0);
    }

    return stringList;
}

export function readEnv_TRUST_PROXY() {
    const trustProxy = readNonEmptyStringEnv('TRUST_PROXY');

    // boolean
    if (trustProxy === "true") return true;
    if (trustProxy === "false") return false;

    // string
    if (isNaN(Number(trustProxy)) || trustProxy.includes('.')) {
        // It is not an integer, so it must be string
        return trustProxy;
    }

    // number
    return parseInt(trustProxy);
}

const cookieSameSiteAttributes = ['lax', 'none', 'strict'] as const;
export type CookieSameSiteAttribute = typeof cookieSameSiteAttributes[number];

export function readEnv_BACKEND_COOKIE_SAMESITE(): CookieSameSiteAttribute {
    const sameSite = readNonEmptyStringEnv('BACKEND_COOKIE_SAMESITE');

    if ((cookieSameSiteAttributes as Readonly<string[]>).includes(sameSite)) {
        return sameSite as CookieSameSiteAttribute;
    }

    envKeyIsInvalidOrMissing('BACKEND_COOKIE_SAMESITE');
}

export function readEnv_FRONTEND_URLS(): string[] {
    const urls = readNonEmptyStringEnv('FRONTEND_URLS').split(',').map(x => x.trim());
    if (urls.includes("")) {
        envKeyIsInvalidOrMissing('FRONTEND_URLS');
    }
    return urls;
}
