import 'dotenv/config';
import { CookieSameSiteAttribute, NumberEnvRequirement, readBooleanEnv, readEnv_BACKEND_COOKIE_SAMESITE, readEnv_TRUST_PROXY, readNonEmptyStringEnv, readNumberEnv, readOptionalStringEnv } from './helpers';

export const DEBUG: boolean = readBooleanEnv('DEBUG');
export const ENABLE_LOGGING: boolean = readBooleanEnv('ENABLE_LOGGING');
export const SERVER_PORT: number = readNumberEnv('SERVER_PORT', NumberEnvRequirement.MUST_BE_POSITIVE_OR_ZERO);
export const TRUST_PROXY: boolean|string|number = readEnv_TRUST_PROXY();

export const BACKEND_COOKIE_DOMAIN: string = readNonEmptyStringEnv('BACKEND_COOKIE_DOMAIN');
export const BACKEND_COOKIE_SAMESITE: CookieSameSiteAttribute = readEnv_BACKEND_COOKIE_SAMESITE();
export const FRONTEND_URL: string = readNonEmptyStringEnv('FRONTEND_URL');
