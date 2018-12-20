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
    },
    async order(parent, args, ctx, info) {
        // 1. Make sure they are logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in');
        }

        // 2. Query the current order
        const order = await ctx.db.query.order({
            where: {
                id: args.id
            }
        }, info);

        // 3. Check if they have permissions
        const ownsOrder = order.user.id === ctx.request.userId;
        const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');

        if (!ownsOrder || !hasPermissionToSeeOrder) {
            throw new Error('You cant see this brother');
        }
        // 4. Return the order
        return order;
    },
    async orders(parent, args, ctx, info) {
        // 1. Check if logged in
        if (!ctx.request.userId) {
            throw new Error('You must be logged in');
        }

        // 2. Return all the orders
        const orders = await ctx.db.query.orders({
            where: {
                user: {
                    id: ctx.request.userId
                }
            }
        }, info);
        

        return orders;
    },
};

module.exports = Query;
