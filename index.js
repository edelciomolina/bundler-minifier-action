const core = require('@actions/core')
const generate = require('./lib/generate.js')
const minify = require('./lib/minify.js')
const clean = require('./lib/clean.js')

const bundle_config_folder = core.getInput('bundle_config_folder') || './test'
const search_extensions = core.getInput('search_extensions') || ['.js', '.css', '.html']
const delete_input_files = (core.getInput('delete_input_files') || 'true') === 'true'
const create_bundle_config = core.getInput('create_bundle_config') || true

try {
    if (create_bundle_config) {
        generate.Process({
            bundle_config_folder,
            search_extensions,
            progress: (result) => {
                console.info(result)
            },
        })
        console.info('The bundleconfig.json was generated!')
    }

    minify.Process({
        bundle_config_folder,
        progress: (result) => {
            console.info(result)
        },
    })
    console.info('All files minified!')

    if (delete_input_files) {
        clean.Process({
            bundle_config_folder,
            progress: (result) => {
                console.info(`Deleted `, result)
            },
        })
        core.info('All files non minified was deleted!')
    }
} catch (error) {
    console.error(error.message)
}
