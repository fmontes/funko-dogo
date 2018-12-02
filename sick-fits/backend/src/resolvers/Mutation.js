const mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO: check if they are log in

        const item = await ctx.db.mutation.createItem({
            data: {
                ...args
            }
        }, info);

        return item;
    }
};

module.exports = mutations;
