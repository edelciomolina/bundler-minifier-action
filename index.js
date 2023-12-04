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
        })
        core.setOutput('The bundleconfig.json was generated!')
    }

    minify.Process()
    core.setOutput('All files minified!')

    if (delete_input_files) {
        clean.Process()
        core.setOutput('Bundle config input files deleted!')
    }
} catch (error) {
    core.setFailed(error.message)
}
