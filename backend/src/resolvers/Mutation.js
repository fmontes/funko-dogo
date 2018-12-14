const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto'); // Built in to node
const { promisify } = require('util'); // Built in to node

const mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO: check if they are log in

        const item = await ctx.db.mutation.createItem(
            {
                data: {
                    ...args
                }
            },
            info
        );

        return item;
    },
    updateItem(parent, args, ctx, info) {
        // take a copy of the update object
        const updates = { ...args };
        delete updates.id;

        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id
                }
            },
            info
        );
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };

        // 1. Find the item
        const item = await ctx.db.query.item(
            { where },
            `{
            id
            title
        }`
        );

        // 2. Check if they own that item, or have permission
        // TODO check user or owner

        // 3. Delete it!
        return ctx.db.mutation.deleteItem({ where }, info);
    },
    async signup(parent, args, ctx, info) {
        args.email = args.email.toLowerCase();
        const password = await bcrypt.hash(args.password, 10);

        // 1. create the user in the apollo db
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permissions: { set: ['USER'] }
                }
            },
            info
        );

        // 2. create the JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // 3. set the jwt as a cookie in the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        });

        return user;
    },
    async signin(parent, { email, password }, ctx, info) {
        // 1. check is there is a user with email
        const user = await ctx.db.query.user({ where: { email: email } });
        if (!user) {
            throw new Error(`No user found for ${email}`);
        }

        // 2. check is password is correct
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Invalid password');
        }

        // 3. generate jwt token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // 4. set the cookie with the token
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year cookie
        });

        // 5. return the user
        return user;
    },
    logout(parent, args, ctx, info) {
        ctx.response.clearCookie('token');
        return {
            message: 'Goodbye!'
        };
    },
    async requestReset(parent, args, ctx, info) {
        // 1. check if real user
        const user = await ctx.db.query.user({ where: { email: args.email } });

        if (!user) {
            throw new Error(`No user found for ${args.email}`);
        }

        // 2. Set reset toket and expire
        const randomBytesPromisified = promisify(randomBytes);
        const resetToken = (await randomBytesPromisified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1h
        const res = await ctx.db.mutation.updateUser({
            where: { email: args.email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        return {
            message: 'Reset password email on the way'
        };

        // 3. Email them the reset token
    },
    async resetPassword(parent, args, ctx, info) {
        // 1. check if the passwords match
        if (args.password !== args.confirmPassword) {
            throw new Error('Password does not match');
        }

        // 2. check if is a legit reset token
        // 3. check if is expired
        const [user] = await ctx.db.query.users({
            where: {
                resetToken: args.resetToken,
                resetTokenExpiry_gte: Date.now() - 3600000
            }
        });

        if (!user) {
            throw new Error('Token invalid or expired!');
        }

        // 4. Hash their password
        const password = await bcrypt.hash(args.password, 10);

        // 5. Save the new password and remove token fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where: {
                email: user.email
            },
            data: {
                password,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        // 6. Generate jwt
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        
        // 7. Set the jwt cookie
        ctx.response.cookie('token', token,  {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        });
        
        // 8. Return new user
        return updatedUser;
        // 9. YEAH!
    }
};

module.exports = mutations;
