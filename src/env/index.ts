import 'dotenv/config';
import { CookieSameSiteAttribute, NumberEnvRequirement, readBooleanEnv, readEnv_BACKEND_COOKIE_SAMESITE, readEnv_FRONTEND_URLS, readEnv_TRUST_PROXY, readNonEmptyStringEnv, readNumberEnv } from './helpers';

export const DEBUG: boolean = readBooleanEnv('DEBUG');
export const ENABLE_LOGGING: boolean = readBooleanEnv('ENABLE_LOGGING');
export const SERVER_PORT: number = readNumberEnv('SERVER_PORT', NumberEnvRequirement.MUST_BE_POSITIVE_OR_ZERO);
export const TRUST_PROXY: boolean|string|number = readEnv_TRUST_PROXY();

export const BACKEND_SECRET: string = readNonEmptyStringEnv('BACKEND_SECRET');
export const BACKEND_COOKIE_DOMAIN: string = readNonEmptyStringEnv('BACKEND_COOKIE_DOMAIN');
export const BACKEND_COOKIE_SAMESITE: CookieSameSiteAttribute = readEnv_BACKEND_COOKIE_SAMESITE();
export const FRONTEND_URLS: string[] = readEnv_FRONTEND_URLS();

export const DATABASE_URL: string = readNonEmptyStringEnv('DATABASE_URL');
export const SHADOW_DATABASE_URL: string = readNonEmptyStringEnv('SHADOW_DATABASE_URL');
