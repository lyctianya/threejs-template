/** @format */

const path = require('path')
const getPath = function (dir) {
    const appDirectory = process.cwd()
    return path.join(appDirectory, dir)
}
module.exports = {
    getPath,
    SRC: getPath('src'),
    DIST: getPath('dist'),
    MATCH_NODE_MODULES: getPath('/node_modules/'),
    PUBLIC: getPath('public'),
    PATH_SRC: getPath('src')
}
