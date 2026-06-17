import type { Request } from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { PrismaClient } from '../../generated/prisma/client.js';

const DEFAULT_ISSUER = 'https://d1b3cj.logto.app/oidc';
const DEFAULT_AUDIENCE = 'http://localhost:3000/api';
const DISCOVERY_CACHE_TTL_MS = 10 * 60 * 1000;

type JwtClaims = Record<string, unknown> & {
  aud?: string | string[];
  email?: unknown;
  exp?: unknown;
  iat?: unknown;
  iss?: unknown;
  name?: unknown;
  nbf?: unknown;
  preferred_username?: unknown;
  sub?: unknown;
};

export type AuthenticatedUser = {
  userID: number;
  logtoSubject: string;
  email: string | null;
  name: string | null;
};

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

type OpenIdConfiguration = {
  issuer?: string;
  jwks_uri?: string;
};

type DiscoveryCache = {
  expiresAt: number;
  value: OpenIdConfiguration;
};

type JwksCache = {
  issuer: string;
  jwksUri: string;
  resolver: ReturnType<typeof createRemoteJWKSet>;
  expiresAt: number;
};

type CombinedUserClaims = {
  logtoSubject: string;
  email: string | null;
  name: string | null;
};

const discoveryCache: { current: DiscoveryCache | null } = {
  current: null
};

const jwksCache: { current: JwksCache | null } = {
  current: null
};

const getIssuer = (): string => process.env.LOGTO_ISSUER?.trim() || DEFAULT_ISSUER;

const getAudience = (): string | null => {
  const configuredAudience = process.env.LOGTO_AUDIENCE?.trim();

  if (configuredAudience && configuredAudience.length > 0) {
    return configuredAudience;
  }

  return DEFAULT_AUDIENCE;
};

const getBearerToken = (authorizationHeader: string | string[] | undefined): string => {
  const header = Array.isArray(authorizationHeader)
    ? authorizationHeader[0]
    : authorizationHeader;

  if (typeof header !== 'string') {
    throw new AuthError('Missing Authorization header');
  }

  const [scheme, token] = header.trim().split(/\s+/, 2);

  if (scheme !== 'Bearer' || !token) {
    throw new AuthError('Authorization header must use Bearer scheme');
  }

  return token;
};

const getStringClaim = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
};

const getTokenFromHeader = (headerValue: string | string[] | undefined): string | null => {
  const header = Array.isArray(headerValue) ? headerValue[0] : headerValue;

  if (typeof header !== 'string') {
    return null;
  }

  const trimmed = header.trim();

  return trimmed.length > 0 ? trimmed : null;
};

const getDiscoveryDocument = async (issuer: string): Promise<OpenIdConfiguration> => {
  const cached = discoveryCache.current;

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const discoveryUrl = `${issuer.replace(/\/$/, '')}/.well-known/openid-configuration`;
  const response = await fetch(discoveryUrl);

  if (!response.ok) {
    throw new AuthError(`Failed to load Logto discovery document (${response.status})`, 503);
  }

  const value = (await response.json()) as OpenIdConfiguration;

  discoveryCache.current = {
    expiresAt: Date.now() + DISCOVERY_CACHE_TTL_MS,
    value
  };

  return value;
};

const getJwksResolver = async (issuer: string) => {
  const discovery = await getDiscoveryDocument(issuer);
  const jwksUri = discovery.jwks_uri;

  if (!jwksUri) {
    throw new AuthError('Logto discovery document did not include a JWKS URI', 503);
  }

  const cached = jwksCache.current;

  if (cached && cached.issuer === issuer && cached.jwksUri === jwksUri && cached.expiresAt > Date.now()) {
    return cached.resolver;
  }

  const resolver = createRemoteJWKSet(new URL(jwksUri));

  jwksCache.current = {
    issuer,
    jwksUri,
    resolver,
    expiresAt: Date.now() + DISCOVERY_CACHE_TTL_MS
  };

  return resolver;
};

const mapClaimsToUserData = (claims: JwtClaims) => {
  const logtoSubject = getStringClaim(claims.sub);

  if (!logtoSubject) {
    throw new AuthError('Token subject is missing');
  }

  const email = getStringClaim(claims.email);
  const name = getStringClaim(claims.name) ?? getStringClaim(claims.preferred_username);

  return {
    logtoSubject,
    email,
    name
  };
};

const mergeClaims = (primary: JwtClaims, profile?: JwtClaims | null): CombinedUserClaims => {
  const primaryUser = mapClaimsToUserData(primary);
  const profileUser = profile ? mapClaimsToUserData(profile) : null;

  return {
    logtoSubject: primaryUser.logtoSubject,
    email: profileUser?.email ?? primaryUser.email,
    name: profileUser?.name ?? primaryUser.name
  };
};

export const authenticateRequest = async (
  prisma: PrismaClient,
  request: Request
): Promise<AuthenticatedUser> => {
  const token = getBearerToken(request.headers.authorization);
  const issuer = getIssuer();
  const audience = getAudience();
  const accessClaims = (await jwtVerify(token, await getJwksResolver(issuer), {
    issuer,
    ...(audience ? { audience } : {})
  })).payload as JwtClaims;
  const idToken = getTokenFromHeader(request.headers['x-logto-id-token']);
  const idTokenClaims = idToken
    ? ((await jwtVerify(idToken, await getJwksResolver(issuer), {
        issuer,
        audience: process.env.LOGTO_CLIENT_ID?.trim() || 'r6ezkh88cu89fjh9bv39g'
      })).payload as JwtClaims)
    : null;
  const userData = mergeClaims(accessClaims, idTokenClaims);

  const user = await prisma.user.upsert({
    where: {
      logtoSubject: userData.logtoSubject
    },
    create: {
      logtoSubject: userData.logtoSubject,
      email: userData.email,
      name: userData.name
    },
    update: {
      ...(userData.email ? { email: userData.email } : {}),
      ...(userData.name ? { name: userData.name } : {})
    }
  });

  return {
    userID: user.userID,
    logtoSubject: user.logtoSubject,
    email: user.email,
    name: user.name
  };
};

export const getUserFromClaims = async (
  prisma: PrismaClient,
  claims: JwtClaims
): Promise<AuthenticatedUser> => {
  const userData = mapClaimsToUserData(claims);

  const user = await prisma.user.upsert({
    where: {
      logtoSubject: userData.logtoSubject
    },
    create: {
      logtoSubject: userData.logtoSubject,
      email: userData.email,
      name: userData.name
    },
    update: {
      ...(userData.email ? { email: userData.email } : {}),
      ...(userData.name ? { name: userData.name } : {})
    }
  });

  return {
    userID: user.userID,
    logtoSubject: user.logtoSubject,
    email: user.email,
    name: user.name
  };
};

export const parseBearerToken = getBearerToken;
export const resolveAuthenticatedUserFields = mapClaimsToUserData;
