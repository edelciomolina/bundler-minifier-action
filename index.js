const core = require('@actions/core')
const generate = require('./lib/generate.js')
const minify = require('./lib/minify.js')
const clean = require('./lib/clean.js')

const args = process.argv.slice(2)
const bundleConfigFolder = args[args.indexOf('--bundle-config-folder') + 1]
const createBundleConfig = args[args.indexOf('--create-bundle-config') + 1]
const searchExtensions = args[args.indexOf('--search-extensions') + 1]
const deleteInputFiles = args[args.indexOf('--delete-input-files') + 1]

const bundle_config_folder = bundleConfigFolder || './test'
const search_extensions = ('.' + (searchExtensions || 'js|css|html').split('|').join(',.')).split(',')
const delete_input_files = (deleteInputFiles || 'true') === 'true'
const create_bundle_config = (createBundleConfig || 'true') === 'true'

try {
    core.info(`✅ You are here "${process.cwd()}"`)

    core.info(`✅ Input Parameters`)
    core.info(` - bundle_config_folder: ${bundle_config_folder}`)
    core.info(` - create_bundle_config: ${create_bundle_config}`)
    core.info(` - search_extensions: ${search_extensions}`)
    core.info(` - delete_input_files: ${delete_input_files}`)

    if (create_bundle_config) {
        generate.Process({
            bundle_config_folder,
            search_extensions,
            progress: (result) => {
                core.info(` - Processed ${result}`)
            },
        })
        core.info('✅ The bundleconfig.json was generated!')
    }

    minify.Process({
        bundle_config_folder,
        progress: (result) => {
            core.info(result)
        },
    })
    core.info('✅ All files minified!')

    if (delete_input_files) {
        clean.Process({
            bundle_config_folder,
            progress: (result) => {
                core.info(` - Deleted ${result}`)
            },
        })
        core.info('✅ All files non minified was deleted!')
    }
} catch (error) {
    core.error(error.message)
}
