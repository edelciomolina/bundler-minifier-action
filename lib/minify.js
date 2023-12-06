const path = require('path')
const { execSync } = require('child_process')

var Minify = (() => {
    function Clear(opt) {
        const bundle_config_folder = opt.bundle_config_folder
        const bundle_config_file = path.join(process.cwd(), bundle_config_folder, 'bundleconfig.json')
        const bundlerMinifierConsole = path.join(
            process.cwd(),
            'bundler-minifier-action/bin/BundlerMinifierConsole.exe',
        )
        const options = { cwd: path.join(process.cwd(), bundle_config_folder) }

        const cleanArgs = ['clean', `"${bundle_config_file}"`]
        execSync(`${bundlerMinifierConsole} ${cleanArgs.join(' ')} > NUL 2>&1`, options)
    }

    function Process(opt) {
        Clear(opt)

        const bundle_config_folder = opt.bundle_config_folder
        const bundle_config_file = path.join(process.cwd(), bundle_config_folder, 'bundleconfig.json')
        const bundlerMinifierConsole = path.join(
            process.cwd(),
            'bundler-minifier-action/bin/BundlerMinifierConsole.exe',
        )
        const minifyArgs = [`"${bundle_config_file}"`]

        const options = { cwd: path.join(process.cwd(), bundle_config_folder) }

        const minifyResult = execSync(`${bundlerMinifierConsole} ${minifyArgs.join(' ')} > NUL 2>&1`, options)

        const result = minifyResult.toString()
        if (opt.progress) opt.progress(result)
    }

    return {
        Process,
    }
})()

module.exports = Minify
