const { program } = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const yaml = require('js-yaml');

program
  .option('-d, --destination <destination>', 'Diretório de destino para o arquivo')
  .parse(process.argv);

const caminhoPastaAtual = path.dirname(process.argv[1]);
const filesConfigPath = `${caminhoPastaAtual}/files.yaml`;
const caminhoPastaDocs = caminhoPastaAtual.substring(0, caminhoPastaAtual.length-24)
const destination = program.destination || `${caminhoPastaDocs}/Diagramas`;
  
// Lê o arquivo YAML
let filesConfig;
try {
  filesConfig = yaml.load(fs.readFileSync(filesConfigPath, 'utf8'));
} catch (error) {
  console.error('Erro ao ler o arquivo files.yaml:', error);
  process.exit(1);
}

clear()
console.log(figlet.textSync('Diagram Catalog'))

// Cria a lista de opções para o inquirer
const choices = filesConfig.map(file => ({
  name: `${file.name} - ${file.description}`,
  value: file.path,
}));

// Exibe a lista de arquivos e solicita o usuário a escolher um
inquirer.prompt([
  {
    type: 'list',
    name: 'selectedFile',
    message: 'Selecione um arquivo para usar:',
    choices,
  },
])
.then(answers => {
  const selectedFile = `${caminhoPastaAtual}${answers.selectedFile}`;
  const targetPath = path.join(destination, path.basename(selectedFile));

  // Copia o arquivo para a pasta de destino
  fs.copyFile(selectedFile, targetPath, (err) => {
    if (err) {
      console.error('Erro ao copiar o arquivo:', err);
      process.exit(1);
    }

    console.log(`Arquivo ${path.basename(selectedFile)} copiado para ${destination}`);
  });
})
.catch(error => {
  console.error('Erro:', error);
  process.exit(1);
});