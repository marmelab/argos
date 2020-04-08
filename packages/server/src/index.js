const Koa = require('koa');
const Router = require('koa-router');
const measureRepository = require('./measureRepository');

const server = new Koa();

const router = new Router();

router.get('/containers', async (ctx, next) => {
    ctx.body = await measureRepository.getContainers();
    ctx.status = 200;
});

server.use(router.routes()).use(router.allowedMethods());

server.listen(3003);
