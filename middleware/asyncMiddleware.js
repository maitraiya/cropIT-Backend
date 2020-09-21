function asyncMiddleware(handler) {
    return async(req, res, next) => {
        try {
            await handler(req, res, next);
        } catch (ex) {
            res.status(500).send('Internal Server Error');
            next(ex);
        }
    };
}
module.exports = asyncMiddleware;