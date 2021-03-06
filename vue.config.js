console.log('环境--------' + process.env.NODE_ENV)
const path = require("path");
const Time = new Date().getTime();
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: process.env.NODE_ENV === 'pro'
        ? '/'
        : (process.env.NODE_ENV === 'test' ? '/' : '/'), // 打包输入的时候index.html前面加上了链接/
    devServer: {
        proxy: {
            '/api': {
                // target: 'http://test.hletong.com/apis',
                // target: 'http://test.hletong.com/hhgs-test',
                // target: 'https://yq.hletong.com',
                 target: 'http://192.168.4.16:25098',// 周杨
                // target: 'http://192.168.4.16:25084',// 周杨
                // target: 'http://192.168.4.16:25091/hhgs',// 佘慧
                // target: 'http://192.168.4.16:25092/hhgs',// 尹凯
                // target:'http://10.1.15.119:8202/'
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                },
                headers: {
                     "Cookie": "JSESSIONID=F7CF2D541BC247753A08CC6FF72E8A16; __sid=4D649C255317490E8BDF59FA12987DBE", // 超级管理员
                    //  "X-Auth-Token": "817F96BFE62A4745B9C1D48B484B182E"
                    // "Authorization":'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiV0VCUyJdLCJ1c2VyX2lkIjoxLCJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE1NDIyODcxNDcsImF1dGhvcml0aWVzIjpbInN1cGVyIiwiYWRtaW4iXSwianRpIjoiYzJkOGRkYTAtZjAwNy00NDdjLTg4Y2EtMTgwMjRhOWJlZGI2IiwiY2xpZW50X2lkIjoiemhlbmctdXBtcy1zZXJ2ZXIifQ.cqfCHUn8zCcTpVK-BOBNnZE5mgaczaQhAXE3Kb2Mcss'
                }
            }
        }
    },
    configureWebpack: {
		externals: {
            hlet: 'hlet',
            hletComponents:'hletComponents'
		}
	},    
    lintOnSave: false,
    chainWebpack: config => {
        if (process.env.NODE_ENV === 'test') {
            config.output.filename(`[name].${Time}.[hash].js`).end();
        }
        config.resolve.alias.set("@", resolve("src"));
        config.resolve.alias.set("components", resolve("src/components"));
        config.resolve.alias.set("common", resolve("src/common"));
        config.resolve.alias.set("views", resolve("src/views"));
        config.resolve.alias.set("api", resolve("src/api"))
        config.resolve.alias.set("util", resolve("src/util"))
    },
}
