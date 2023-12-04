const path = require('path')
const { execSync } = require('child_process')

var Minify = (() => {
    function Process(opt) {
        const bundle_config_folder = opt.bundle_config_folder
        const bundle_config_file = path.join(process.cwd(), bundle_config_folder, 'bundleconfig.json')
        const bundlerMinifierConsole = path.join(process.cwd(), 'bin/BundlerMinifierConsole.exe')
        const cleanArgs = ['clean', `"${bundle_config_file}"`]
        const minifyArgs = [`"${bundle_config_file}"`]

        const options = { cwd: path.join(process.cwd(), bundle_config_folder) }

        const cleanResult = execSync(`${bundlerMinifierConsole} ${cleanArgs.join(' ')}`, options)
        const minifyResult = execSync(`${bundlerMinifierConsole} ${minifyArgs.join(' ')}`, options)

        const result = cleanResult.toString() + minifyResult.toString()
        if (opt.progress) opt.progress(result)
    }

    return {
        Process,
    }
})()

module.exports = Minify
