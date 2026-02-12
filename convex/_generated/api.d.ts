/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as games from "../games.js";
import type * as health from "../health.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_scoring from "../lib/scoring.js";
import type * as lib_validators from "../lib/validators.js";
import type * as openings from "../openings.js";
import type * as publishAuto from "../publishAuto.js";
import type * as seed from "../seed.js";
import type * as seedData_openings from "../seedData/openings.js";
import type * as seedData_spirits from "../seedData/spirits.js";
import type * as spirits from "../spirits.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  games: typeof games;
  health: typeof health;
  "lib/auth": typeof lib_auth;
  "lib/scoring": typeof lib_scoring;
  "lib/validators": typeof lib_validators;
  openings: typeof openings;
  publishAuto: typeof publishAuto;
  seed: typeof seed;
  "seedData/openings": typeof seedData_openings;
  "seedData/spirits": typeof seedData_spirits;
  spirits: typeof spirits;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
