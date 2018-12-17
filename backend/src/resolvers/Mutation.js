const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto'); // Built in to node
const { promisify } = require('util'); // Built in to node
const { hasPermission } = require('../utils');

const { transport, makeANiceEMail } = require('../mail');

const mutations = {
    async createItem(parent, args, ctx, info) {
        // TODO: check if they are log in
        if (!ctx.request.userId) {
            throw new Error('You need to be logged in');
        }

        const item = await ctx.db.mutation.createItem(
            {
                data: {
                    // this is how you create relationships in prisma
                    user: {
                        connect: {
                            id: ctx.request.userId
                        }
                    },
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
                title,
                user { id }
            }`
        );

        // 2. Check if they own that item, or have permission
        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermissions = ctx.request.user.permissions.some(permission =>
            ['ADMIN', 'ITEMDELETE'].includes(permission)
        );

        if (!ownsItem && !hasPermissions) {
            throw new Error('You dont have permission to remove an item');
        }

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

        // 3. Email them the reset token
        // transport, makeANiceEMail
        const mainRes = await transport.sendMail({
            from: 'shop@domain.com',
            to: user.email,
            subject: 'Password reset token',
            html: makeANiceEMail(
                `Your password reset token is here \n\n
                <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">Click here to reset</a>`
            )
        });

        // 4. Return the message
        return {
            message: 'Reset password email on the way'
        };
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
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365
        });

        // 8. Return new user
        return updatedUser;
        // 9. YEAH!
    },
    async updatePermissions(parent, args, ctx, info) {
        // 1. check if user logged in
        if (!ctx.request.userId) {
            throw new Error('You need to be logged in');
        }

        // 2. query the corrent user
        const currentUser = await ctx.db.query.user(
            {
                where: {
                    id: ctx.request.userId
                }
            },
            info
        );

        // 3. check if they have permission to update permissions
        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

        // 4. update permissions
        return ctx.db.mutation.updateUser(
            {
                data: {
                    permissions: {
                        // This set is cuz' permission have it owns ENUM
                        set: args.permissions
                    }
                },
                where: {
                    id: args.userId
                }
            },
            info
        );
    },
    async addToCart(parent, args, ctx, info) {
        // 1. check if user logged in
        const { userId } = ctx.request
        if (!userId) {
            throw new Error('You need to be logged in');
        }
        // 2. Query users current cart
        const [existingCartItem] = await ctx.db.query.cartItems({
            where: {
                user: { id: userId },
                item: { id: args.id }
            }
        })

        // 3. Check if the item is already in the cart and increment by 1 if it is
        if (existingCartItem) {
            console.log('This item is already in the cart');
            return ctx.db.mutation.updateCartItem({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 }
            }, info)
        }
        // 4. If item is not in the cart create a fresh cart item for that user
        return ctx.db.mutation.createCartItem({
            data: {
                user: {
                    connect: { id: userId }
                },
                item: {
                    connect: { id: args.id }
                }
            }
        }, info)
    },
    async removeFromCart(parent, args, ctx, info) {
        // 1. Find the cart item
        const cartItem = await ctx.db.query.cartItem({
            where: {
                id: args.id
            }
        }, `{id, user { id }}`);
        // 1.5 Make sure we found item
        if (!cartItem) throw new Error('No CartItem found');
        // 2. Make user they oen the cart item
        if (cartItem.user.id !== ctx.request.userId) {
            throw new Error('This is not your cart');
        }
        // 3. Delete cart item
        return ctx.db.mutation.deleteCartItem({
            where: {
                id: args.id
            }
        }, info)
    }
};

module.exports = mutations;
