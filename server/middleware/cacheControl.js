/**
 * Middleware to add Cache-Control headers for public GET routes.
 * - Public product/service/blog endpoints: cache for 5 minutes, stale-while-revalidate 1 minute
 * - Admin/auth endpoints: no-cache
 */
const cacheControl = (maxAge = 300, staleWhileRevalidate = 60) => {
    return (req, res, next) => {
        if (req.method !== 'GET') return next();

        // Never cache authenticated or admin routes
        const noCache = ['/admin', '/auth', '/users'];
        const isNoCacheRoute = noCache.some(p => req.path.startsWith(p));

        if (isNoCacheRoute) {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        } else {
            res.setHeader(
                'Cache-Control',
                `public, max-age=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
            );
        }
        next();
    };
};

module.exports = cacheControl;
