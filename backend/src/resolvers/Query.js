const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
    items: forwardTo('db'),
    item: forwardTo('db'),
    itemsConnection: forwardTo('db'),
    me(parent, args, ctx, info) {
        // check if there is a current user ID

        if (!ctx.request.userId) {
            return null;
        }
        return ctx.db.query.user(
            {
                where: { id: ctx.request.userId }
            },
            info
        );
    },
    async users(parent, args, ctx, info) {
        // 1. Check if logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in');
        }

        // 2. Check if user has permission to query all users
        // This function throws an error if no permissions
        hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

        // 3. Return all the users
        return ctx.db.query.users({}, info);
    }
};

module.exports = Query;
