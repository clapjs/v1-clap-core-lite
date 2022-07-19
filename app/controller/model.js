'use strict';
/**
 * @Controller Model
 */
const Controller = require('egg').Controller;

class ClapModel extends Controller {
    /**
     * @summary 获取模型全部数据
     * @description 根据模型获取模型全部数据
     * @router get /api/model/{model}
     * @request path string *model
     */

    async get() {
        const {ctx, service} = this;
        let {filter, order, skip, limit, project, populate} = ctx.query;

        const error = {
            code: '0',
        };

        const count = await ctx.collection.countDocuments(filter);
        let records = await ctx.collection.find(filter, project)
            .sort(order)
            .skip(skip)
            .limit(limit)
            .catch(e => {
                if (e) {
                    error.code = e.code;
                    error.message = e.message;
                }
                console.info(e);
            });
        if (populate) {
            records = await ctx.collection.deepPopulate(records, populate.split(','))
                .catch(e => {
                    if (e) {
                        error.code = e.code;
                        error.message = e.message;
                    }
                    console.info(e);
                });
        }
        ctx.body = error.code === '0' ? {error, count, records} : {error};
    }

    /**
     * @summary 获取模型单条数据
     * @description 根据模型模型单条数据
     * @router get /api/model/{model}/{id}
     * @request path string *model
     * @request path string *id
     */

    async getById() {
        const error = {
            code: '0',
        };
        const {ctx, service} = this;
        let records = await ctx.collection.find({_id: {$in: ctx.params.id.split(',')}}, ctx.query.project)
            .catch(e => {
                if (e) {
                    error.code = e.code;
                    error.message = e.message;
                }
                console.info(e);
            });

        if (ctx.query.populate) {
            records = await ctx.collection.deepPopulate(records, ctx.query.populate.split(','))
                .catch(e => {
                    if (e) {
                        error.code = e.code;
                        error.message = e.message;
                    }
                    console.info(e);
                });
        }

        ctx.body = error.code === '0' ? {
            error,
            records,
        } : {
            error,
        };
    }

    /**
     * @summary 获取模型全部数据
     * @description 根据模型获取全部数据
     * @router post /api/getByPost/{model}
     * @request path string *model
     * @request body commonObject body
     */

    async getByPost() {
        const {ctx, service} = this;

        const error = {code: '0'};

        const {filter, order, limit, skip, populate, project} = ctx.GeneratorQuery(ctx.request.body);

        const count = await ctx.collection.countDocuments(filter);

        let records = await ctx.collection.find(filter, project)
            .sort(order)
            .skip(skip)
            .limit(limit)
            .catch(e => {
                if (e) {
                    error.code = e.code;
                    error.message = e.message;
                }
                console.info(e);
            });

        if (ctx.request.body.populate) {
            records = await ctx.collection.deepPopulate(records, ctx.request.body.populate.split(','))
                .catch(e => {
                    if (e) {
                        error.code = e.code;
                        error.message = e.message;
                    }
                    console.info(e);
                });
        }
        ctx.body = error.code === '0' ? {error, count, records} : {error};
    }

    /**
     * @summary 保存模型数据
     * @description 保存模型数据
     * @router post /api/model/{model}
     * @request path string *model
     * @request body commonObject *body
     */
    async post() {
        const {ctx, service} = this;
        const error = {
            code: '0',
        };
        let records = [];
        if (Array.isArray(ctx.request.body)) {
            for (const b of ctx.request.body) {
                delete b.updatedAt;
                delete b.createdAt;
                const record = await ctx.collection.create(b).catch(e => {
                    if (e) {
                        error.code = e.code;
                        error.message = e.message;
                    }
                    console.info(e);
                });
                records.push(record);
            }
        } else {
            delete ctx.request.body.updatedAt;
            delete ctx.request.body.createdAt;
            records = [await ctx.collection.create(ctx.request.body).catch(e => {
                if (e) {
                    error.code = e.code;
                    error.message = e.message;
                }
                console.info(e);
            })];
        }

        ctx.body = error.code === '0' ? {
            error,
            records,
        } : {
            error,
        };
    }

    /**
     * @summary 更新模型数据
     * @description 根据模型主键更新单条数据
     * @router patch /api/model/{model}/{id}
     * @request path string *model
     * @request path string *id
     * @request body commonObject body
     */
    async update() {
        const error = {
            code: '0',
        };
        const {ctx, service} = this;

        let records;

        const exist = await ctx.collection.findOne({_id: ctx.params.id});
        if (exist) {
            if ((new Date(exist.updatedAt)).toString() === (new Date(ctx.request.body.updatedAt)).toString() || !ctx.request.body.updatedAt) {
                delete ctx.request.body.updatedAt;
                records = await ctx.collection.updateMany({_id: ctx.params.id}, ctx.request.body)
                    .catch(e => {
                        if (e) {
                            error.code = e.code;
                            error.message = e.message;
                        }
                        console.info(e);
                    });
            } else {
                error.code = '909';
                error.message = '当前数据已被修改，请刷新数据后重试！';
            }
        } else {
            error.code = '904';
            error.message = '当前数据已删除！';
        }

        ctx.body = error.code === '0' ? {
            error,
            records,
        } : {
            error,
        };
    }

    /**
     * @summary 删除模型数据
     * @description 根据模型主键删除单条数据
     * @router delete /api/model/{model}/{id}
     * @request path string *model
     * @request path string *id
     */

    async destroy() {
        const error = {
            code: '0',
        };
        const {ctx, service} = this;
        const records = await ctx.collection.deleteMany({_id: {$in: ctx.params.id.split(',')}})
            .catch(e => {
                if (e) {
                    error.code = e.code;
                    error.message = e.message;
                }
                console.info(e);
            });

        ctx.body = error.code === '0' ? {
            error,
            records,
        } : {
            error,
        };
    }

    /**
     * @summary 获取模型数据
     * @description 根据模型构造管道获取数据
     * @router post /api/getByAggregate/{model}
     * @request path string *model
     * @request body queryObject body
     */

    async getByAggregate() {
        const {ctx, service} = this;
        const error = {code: '0'};
        let {pipeline = [], prePipeline = [], filter = {}, like, likeBy} = ctx.request.body;
        const {order, limit, skip} = ctx.GeneratorQuery(ctx.request.body);
        let likeFilter = {};
        if (like && likeBy) {
            likeFilter.$or = [];
            for (const key of likeBy.split(',')) {
                likeFilter.$or.push({[key]: new RegExp(like, 'i')});
            }
        }
        Object.keys(filter).length > 0 && prePipeline.push({$match: filter});
        Object.keys(likeFilter).length > 0 && prePipeline.push({$match: likeFilter});

        const getCount = async () => {
            return await ctx.collection.aggregate([...ctx.helper.toObjectIDs(prePipeline)]).option({allowDiskUse: true})
                .count('count')
                .then(res => res[0] ? res[0].count : 0)
                .catch(e => {
                    if (e) {
                        error.code = e.code;
                        error.message = e.message;
                    }
                    console.info(e);
                })
        };
        const getData = async () => {
            return await ctx.collection.aggregate([...ctx.helper.toObjectIDs(prePipeline), ...ctx.service.mongodb.aggregate.getAggregatePaging({
                order,
                skip,
                limit
            }), ...pipeline]).option({allowDiskUse: true})
                .catch(e => {
                    if (e) {
                        error.code = e.code;
                        error.message = e.message;
                    }
                    console.info(e);
                })
        };
        let [count, records] = await Promise.all([getCount(), getData()]);
        ctx.body = error.code === '0' ? {error, count, records} : {error};
    }
}

module.exports = ClapModel;
