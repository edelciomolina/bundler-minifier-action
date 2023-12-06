const fs = require('fs')
const path = require('path')

var Clean = (() => {
    function Process(opt) {
        const bundle_config_folder = opt.bundle_config_folder
        const bundle_config_file = path.join(process.cwd(), bundle_config_folder, 'bundleconfig.json')

        const bundleConfigContent = fs.readFileSync(bundle_config_file, 'utf-8')
        const bundleConfigLines = bundleConfigContent.split('\n')
        const validJson = bundleConfigLines
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('//'))
            .join('')
            .replace(',]', ']')

        const bundleConfig = JSON.parse(validJson)

        function deleteFilesRecursive(directory, inputFiles) {
            inputFiles.forEach((inputFile) => {
                const filePath = path.join(directory, inputFile)

                if (fs.existsSync(filePath)) {
                    if (fs.statSync(filePath).isDirectory()) {
                        // Se for um diretório, chama a função recursivamente
                        const filesInDirectory = fs.readdirSync(filePath)
                        deleteFilesRecursive(filePath, filesInDirectory)
                    } else {
                        fs.unlinkSync(filePath)
                    }
                }
            })
        }

        bundleConfig.forEach((bundle) => {
            deleteFilesRecursive(bundle_config_folder, bundle.inputFiles)
        })

        fs.unlinkSync(bundle_config_file)
    }

    return {
        Process,
    }
})()

module.exports = Clean
