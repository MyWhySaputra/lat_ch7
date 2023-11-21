import * as Sentry from '@sentry/node';

export function initializeSentry(dsn) {
    Sentry.init({
        dsn,
        tracesSampleRate: 1.0,
    });
}