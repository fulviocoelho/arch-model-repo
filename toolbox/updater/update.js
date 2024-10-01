const { exec, execSync } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { copySync, copyFileSync } = require('fs-extra');
const { rimraf } = require('rimraf');
const kleur = require('kleur'); // Importa a biblioteca kleur

const execAsync = promisify(exec);

async function updateProjectFromGit(projectDir, gitRepoUrl, branch = 'main', pastasACopiar, arquivosACopiar) {
  try {
    console.log(kleur.blue(`Iniciando atualização do projeto em '${projectDir}'...`));

    // Verifica se o diretório do projeto existe
    console.log(kleur.cyan('Verificando se o diretório do projeto existe...'));
    if (!fs.existsSync(projectDir)) {
      throw new Error(`O diretório do projeto '${projectDir}' não existe.`);
    }

    // Clona o repositório Git para uma pasta temporária
    console.log(kleur.cyan('Clonando o repositório Git para uma pasta temporária...'));
    const tempDir = path.join(projectDir, '.temp-repo');
    await execAsync(`git clone --depth 1 --branch ${branch} ${gitRepoUrl} ${tempDir}`);

    // Atualiza o package.json do projeto
    console.log(kleur.cyan('Atualizando o package.json do projeto...'));
    const packageJsonPath = path.join(projectDir, 'package.json');
    const tempPackageJsonPath = path.join(tempDir, 'package.json');
    const tempPackageJson = require(tempPackageJsonPath);

    // Atualiza as dependências e dependências de desenvolvimento
    const packageJson = require(packageJsonPath);
    packageJson.config = tempPackageJson.config;
    packageJson.scripts = tempPackageJson.scripts;
    packageJson.dependencies = tempPackageJson.dependencies;
    packageJson.devDependencies = tempPackageJson.devDependencies;

    // Salva as alterações no package.json
    console.log(kleur.cyan('Salvando as alterações no package.json...'));
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Copia a pasta para a raiz do projeto
    for (const pastaACopiar of pastasACopiar) {
      console.log(kleur.cyan(`Copiando a pasta '${pastaACopiar}' para a raiz do projeto...`));
      const pastaOrigem = path.join(tempDir, pastaACopiar);
      const pastaDestino = path.join(projectDir, pastaACopiar);
      copySync(pastaOrigem, pastaDestino, { overwrite: true });
    }
    
    for (const arquivoACopiar of arquivosACopiar){
      console.log(kleur.green(`Copiando o arquivo '${arquivoACopiar}' para a raiz do projeto...`));
      const arquivoOrigem = path.join(tempDir, arquivoACopiar);
      const arquivoDestino = path.join(projectDir, arquivoACopiar);
      copyFileSync(arquivoOrigem, arquivoDestino);
    }

    console.log(kleur.green(`O projeto em '${projectDir}' foi atualizado com sucesso!`));
  } catch (error) {
    console.error(kleur.red(`Erro ao atualizar o projeto: ${error.message}`));
  }
}

// Exemplo de uso:
const caminhoPastaAtual = path.dirname(process.argv[1]);
const projectDir = caminhoPastaAtual.substring(0, caminhoPastaAtual.length-16); // Substitua pelo caminho do seu projeto
const gitRepoUrl = 'https://github.com/fulviocoelho/arch-model-repo.git'; // Substitua pelo URL do repositório Git
const branch = 'main'; // Substitua pelo nome do branch desejado
const pastasACopiar = ['toolbox', '.vscode', '.husky']; // Substitua pelo nome da pasta a ser copiada
const arquivosACopiar = ['.gitignore']; // Substitua pelo nome do arquivo a ser copiado

updateProjectFromGit(projectDir, gitRepoUrl, branch, pastasACopiar, arquivosACopiar);