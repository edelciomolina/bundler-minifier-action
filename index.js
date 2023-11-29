const core = require('@actions/core');
const fs = require("fs");
const path = require("path");

const outputFile = core.getInput('bundle_config_file') || path.join(rootDir, "bundleconfig.json"); // Caminho para o arquivo de saída
const rootDir = process.cwd(); // Diretório raiz
const searchExtensions = core.getInput('search_extensions') || [".js", ".css", ".html"]; // Extensões dos arquivos a serem procurados

// Função recursiva para percorrer a pasta
function processDirectory(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const fileExtension = path.extname(file);

    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath); // Se for um diretório, chama recursivamente a função
    } else if (shouldProcessFile(filePath, fileExtension)) {
      const outputFileName = normalizePath(filePath)
        .replace(".js", ".min.js")
        .replace(".css", ".min.css")
        .replace(".html", ".min.html");
      const inputFiles = [normalizePath(filePath)];
      const obj = createBundleObject(outputFileName, inputFiles, fileExtension);

      // Escreve o objeto no arquivo bundleconfig.json
      appendObjectToFile(JSON.stringify(obj, null, "\t") + ",\n");
    }
  });
}

// Verifica se o arquivo deve ser processado
function shouldProcessFile(file, fileExtension) {
  const isMinified = file.includes(".min.");
  const isObjFolder = file.includes("\\obj");
  const isBinFolder = file.includes("\\bin");
  const isPlayFolder = file.includes("\\play");
  const isAssetsFolder = file.includes("\\assets");
  return (
    searchExtensions.includes(fileExtension) && //
    !isMinified &&
    !isObjFolder &&
    !isBinFolder &&
    !isPlayFolder &&
    !isAssetsFolder
  );
}

// Obtém o nome do arquivo de saída relativo ao diretório raiz
function normalizePath(filePath) {
  let ret = filePath //
    .replace(rootDir, "")
    .replace(/\\/g, "/");
  return ret.substring(1);
}

// Cria o objeto bundle correspondente ao arquivo
function createBundleObject(outputFileName, inputFiles, fileExtension) {
  const obj = {
    outputFileName,
    inputFiles,
  };

  if (fileExtension === ".html") {
    obj.minify = {
      enabled: true,
      collapseBooleanAttributes: false,
      removeQuotedAttributes: false,
    };
  }

  return obj;
}

// Escreve o objeto no arquivo bundleconfig.json
function appendObjectToFile(str) {
  fs.appendFileSync(outputFile, str);
}

// Função principal
function generateBundleConfig() {
  fs.writeFileSync(outputFile, ""); // Limpa o conteúdo do arquivo de saída

  appendObjectToFile("[\n");
  processDirectory(rootDir);
  appendObjectToFile("]\n");

  core.setOutput("bundleconfig.json criado com sucesso!")
}

try {
  generateBundleConfig();
} catch (error) {
  core.setFailed(error.message)
}