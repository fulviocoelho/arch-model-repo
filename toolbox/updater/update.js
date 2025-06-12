import { exec as execCallback, execSync } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { copySync, copyFileSync } from 'fs-extra';
import { rimraf } from 'rimraf';
import { fileURLToPath } from 'url';

// Necessário em ESModules para obter __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execAsync = promisify(execCallback);

async function updateProjectFromGit(projectDir, gitRepoUrl, branch = 'main', pastasACopiar, arquivosACopiar) {
  try {
    console.log(`[INFO] Iniciando atualização do projeto em '${projectDir}'...`);

    // Verifica se o diretório do projeto existe
    console.log('[INFO] Verificando se o diretório do projeto existe...');
    if (!fs.existsSync(projectDir)) {
      throw new Error(`O diretório do projeto '${projectDir}' não existe.`);
    }

    // Clona o repositório Git para uma pasta temporária
    console.log('[INFO] Clonando o repositório Git para uma pasta temporária...');
    const tempDir = path.join(projectDir, '.temp-repo');
    await execAsync(`git clone --depth 1 --branch ${branch} ${gitRepoUrl} ${tempDir}`);

    // Atualiza o package.json do projeto
    console.log('[INFO] Atualizando o package.json do projeto...');
    const packageJsonPath = path.join(projectDir, 'package.json');
    const tempPackageJsonPath = path.join(tempDir, 'package.json');

    const tempPackageJson = JSON.parse(fs.readFileSync(tempPackageJsonPath, 'utf-8'));
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Atualiza as propriedades desejadas
    packageJson.config = tempPackageJson.config;
    packageJson.scripts = tempPackageJson.scripts;
    packageJson.dependencies = tempPackageJson.dependencies;
    packageJson.devDependencies = tempPackageJson.devDependencies;

    // Salva as alterações no package.json
    console.log('[INFO] Salvando as alterações no package.json...');
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Copia as pastas e arquivos desejados
    for (const pastaACopiar of pastasACopiar) {
      console.log(`[INFO] Copiando a pasta '${pastaACopiar}' para a raiz do projeto...`);
      const pastaOrigem = path.join(tempDir, pastaACopiar);
      const pastaDestino = path.join(projectDir, pastaACopiar);
      copySync(pastaOrigem, pastaDestino, { overwrite: true });
    }

    for (const arquivoACopiar of arquivosACopiar) {
      console.log(`[INFO] Copiando o arquivo '${arquivoACopiar}' para a raiz do projeto...`);
      const arquivoOrigem = path.join(tempDir, arquivoACopiar);
      const arquivoDestino = path.join(projectDir, arquivoACopiar);
      copyFileSync(arquivoOrigem, arquivoDestino);
    }

    console.log(`[SUCCESS] O projeto em '${projectDir}' foi atualizado com sucesso!`);
  } catch (error) {
    console.error(`[ERROR] Erro ao atualizar o projeto: ${error.message}`);
  }
}

// Exemplo de uso:
const caminhoPastaAtual = __dirname;
const projectDir = caminhoPastaAtual.substring(0, caminhoPastaAtual.length - 16);
const gitRepoUrl = 'https://github.com/fulviocoelho/arch-model-repo.git';
const branch = 'main';
const pastasACopiar = ['toolbox', '.vscode', '.husky'];
const arquivosACopiar = ['.gitignore'];

updateProjectFromGit(projectDir, gitRepoUrl, branch, pastasACopiar, arquivosACopiar);