const fs = require('fs')
const path = require('path')

var Generate = (() => {
    let bundle_config_file
    let bundle_config_folder
    let search_extensions

    // Função recursiva para percorrer a pasta
    function processDirectory(directory) {
        const files = fs.readdirSync(directory)

        files.forEach((file) => {
            const filePath = path.join(directory, file)
            const fileExtension = path.extname(file)

            if (fs.statSync(filePath).isDirectory()) {
                processDirectory(filePath) // Se for um diretório, chama recursivamente a função
            } else if (shouldProcessFile(filePath, fileExtension)) {
                const outputFileName = normalizePath(filePath)
                    .replace('.js', '.min.js')
                    .replace('.css', '.min.css')
                    .replace('.html', '.min.html')
                const inputFiles = [normalizePath(filePath)]
                const obj = createBundleObject(outputFileName, inputFiles, fileExtension)

                // Escreve o objeto no arquivo bundleconfig.json
                appendObjectToFile(JSON.stringify(obj, null, '\t') + ',\n')
            }
        })
    }

    // Verifica se o arquivo deve ser processado
    function shouldProcessFile(file, fileExtension) {
        const isMinified = file.includes('.min.')
        const isObjFolder = file.includes('\\obj')
        const isBinFolder = file.includes('\\bin')
        const isPlayFolder = file.includes('\\play')
        const isAssetsFolder = file.includes('\\assets')
        return (
            search_extensions.includes(fileExtension) && //
            !isMinified &&
            !isObjFolder &&
            !isBinFolder &&
            !isPlayFolder &&
            !isAssetsFolder
        )
    }

    // Obtém o nome do arquivo de saída relativo ao diretório raiz
    function normalizePath(filePath) {
        let ret = filePath //
            .replace(process.cwd(), '')
            .replace(/\\/g, '/')

        let retPath
        if (ret.startsWith('/')) {
            retPath = ret.substring(1)
        } else {
            retPath = ret
        }

        const parts = retPath.split('/')
        parts.shift()
        return parts.join('/')
    }

    // Cria o objeto bundle correspondente ao arquivo
    function createBundleObject(outputFileName, inputFiles, fileExtension) {
        const obj = {
            outputFileName,
            inputFiles,
        }

        if (fileExtension === '.html') {
            obj.minify = {
                enabled: true,
                collapseBooleanAttributes: false,
                removeQuotedAttributes: false,
            }
        }

        return obj
    }

    // Escreve o objeto no arquivo bundleconfig.json
    function appendObjectToFile(str) {
        if (!fs.existsSync(bundle_config_file)) {
            fs.writeFileSync(bundle_config_file, str)
        } else {
            fs.appendFileSync(bundle_config_file, str)
        }
    }

    function start() {
        if (fs.existsSync(bundle_config_file)) fs.unlinkSync(bundle_config_file)
        appendObjectToFile('[\n')
        processDirectory(bundle_config_folder)
        appendObjectToFile(']\n')
    }

    // Função principal
    function Process(opt) {
        bundle_config_folder = opt.bundle_config_folder
        bundle_config_file = path.join(path.join(process.cwd(), bundle_config_folder), 'bundleconfig.json')
        search_extensions = opt.search_extensions
        start()
    }

    return {
        Process,
    }
})()

module.exports = Generate
