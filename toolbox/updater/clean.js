const { exec, execSync } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { copySync } = require('fs-extra');
const { rimraf } = require('rimraf');
const kleur = require('kleur'); // Importa a biblioteca kleur

async function removePastaTemp(projectDir) {
    try {
      console.log(kleur.cyan('Removendo a pasta temporária...'));
      const tempDir = path.join(projectDir, '.temp-repo');
    //   await rimraf(tempDir, { force: true }); // Tenta remover com força
  
      // Se o rimraf falhar, tenta remover com o comando do sistema
      try {
        await rimraf(tempDir, { force: true });
      } catch (err) {
        console.error(kleur.red(`Erro ao remover a pasta temporária: ${err.message}`));
        // Tenta remover com o comando do sistema (sincronamente)
        if (process.platform === 'win32') {
          execSync(`del /f /s /q "${tempDir}"`); // Windows
        } else {
          execSync(`rm -rf "${tempDir}"`); // Linux/macOS
        }
      }
    } catch (error) {
      console.error(kleur.red(`Erro ao remover a pasta temporária: ${error.message}`));
    }
  }
  
  // Exemplo de uso:
  const caminhoPastaAtual = path.dirname(process.argv[1]);
  const projectDir = caminhoPastaAtual.substring(0, caminhoPastaAtual.length-16); // Substitua pelo caminho do seu projeto
  const gitRepoUrl = 'https://github.com/fulviocoelho/arch-model-repo.git'; // Substitua pelo URL do repositório Git
  const branch = 'main'; // Substitua pelo nome do branch desejado
  const pastaACopiar = 'toolbox'; // Substitua pelo nome da pasta a ser copiada
  
  // Remove a pasta temporária antes de iniciar a atualização
  const tempDir = path.join(projectDir, '.temp-repo');
  if (fs.existsSync(tempDir)) {
    // Aguarda 3 segundos antes de tentar remover a pasta temporária novamente
    setTimeout(() => {
      removePastaTemp(projectDir);
    }, 3000);
  }