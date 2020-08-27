const Koa = require('koa');
const Router = require('koa-router');
const reportRepository = require('./reportRepository');
const measureRepository = require('./measureRepository');
const webpack = require('webpack');
const koaWebpack = require('koa-webpack');
const path = require('path');

const webpackConfig = require('../../front/webpack.config');

const server = new Koa();

const router = new Router();

router.get('/containers', async ctx => {
    ctx.body = await reportRepository.getContainers();
    ctx.status = 200;
});

router.get('/measure/:containerName', async ctx => {
    ctx.body = await reportRepository.getReportForContainer(ctx.params.containerName);
    ctx.status = 200;
});

router.get('/measureRun/:containerName/:measureName/:run', async ctx => {
    ctx.body = await measureRepository.getMeasureForContainerAndMeasureNameAndRun(
        ctx.params.containerName,
        ctx.params.measureName,
        ctx.params.run,
    );
    ctx.status = 200;
});

const startServer = async () => {
    server.use(router.routes()).use(router.allowedMethods());

    const compiler = webpack(webpackConfig);
    const middleware = await koaWebpack({ compiler });

    server.use(middleware);

    server.use(async ctx => {
        const filename = path.resolve(webpackConfig.output.path, 'index.html');
        console.log({ filename });
        ctx.response.type = 'html';
        ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(filename);
    });

    server.listen(3003);
};

startServer();
