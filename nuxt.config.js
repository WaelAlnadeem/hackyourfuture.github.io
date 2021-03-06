const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
const isGenerating = process.env.npm_config_argv ?
      JSON.parse(process.env.npm_config_argv).original.indexOf('generate:nuxt') > -1 : false

let apiUrl = baseUrl

if (isGenerating){
    apiUrl = 'http://localhost:3051/'
}

const lambdaUrl = require('./infra.config.json').api_url.value;

module.exports = {

    env: {
        baseUrl,
        lambdaUrl,
        apiUrl,
        isGenerating
    },

    generated: {
        routes: ['/']
    },

    css: ['@/assets/css/style.scss'],

    modules: [
        ['@nuxtjs/proxy', { pathRewrite: { '^/content' : '/content' } }],
        ['nuxt-sass-resources-loader', '@/assets/css/variablesandmixins.scss']
    ],

    plugins: [
        {src:'~/plugins/VueLayersPlugin', ssr: false}
    ],

    proxy: {
        '/content': 'http://localhost:3051/'
    },
    head: {
        title: 'Hack Your Future',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ]
    }
}
