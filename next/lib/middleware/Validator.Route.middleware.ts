import { PathNormalizerUtility } from '@/lib/utils/Formatter.PathNormalizer.util';
import type { NextRequest } from 'next/server';
import type { RoutesMap, RouteValidation } from '@/lib/routes/Route.types';
import { ConsoleLogger } from '@/lib/logging/Console.logger';

export class RouteValidator {
  static validateRoute(request: NextRequest, routes: RoutesMap): RouteValidation {
    const normalizedPath = PathNormalizerUtility.normalizeForRouting(request.nextUrl.pathname);
    ConsoleLogger.log(('normalizedPath:'), normalizedPath);

    // 1. Try exact match first
    let route = routes[normalizedPath];
    let matchedPattern = normalizedPath;

    // 2. Try pattern matching if exact match fails
    if (!route) {
      const patterns = Object.keys(routes);
      for (const pattern of patterns) {
        if (!pattern.includes(':')) continue;

        // Convert /path/:id/sub -> ^/path/([^/]+)/sub$
        const regexStr = pattern
          .replace(/:[a-zA-Z0-9_]+/g, '([^/]+)')
          .replace(/\//g, '\\/');

        const regex = new RegExp(`^${regexStr}$`);
        if (regex.test(normalizedPath)) {
          route = routes[pattern];
          matchedPattern = pattern;
          break;
        }
      }
    }

    if (!route) {
      return {
        isValid: false,
        route: undefined,
        normalizedPath: undefined
      };
    }

    return {
      isValid: true,
      route,
      normalizedPath: matchedPattern // Return the pattern so it's clear what was matched
    };
  }
}
