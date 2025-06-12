import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { rimraf } from 'rimraf';

async function removePastaTemp(projectDir) {
    try {
      console.log('Removendo a pasta temporária...');
      const tempDir = join(projectDir, '.temp-repo');
    //   await rimraf(tempDir, { force: true }); // Tenta remover com força
  
      // Se o rimraf falhar, tenta remover com o comando do sistema
      try {
        await rimraf(tempDir, { force: true });
      } catch (err) {
        console.error(`Erro ao remover a pasta temporária: ${err.message}`);
        // Tenta remover com o comando do sistema (sincronamente)
        if (process.platform === 'win32') {
          execSync(`del /f /s /q "${tempDir}"`); // Windows
        } else {
          execSync(`rm -rf "${tempDir}"`); // Linux/macOS
        }
      }
    } catch (error) {
      console.error(`Erro ao remover a pasta temporária: ${error.message}`);
    }
  }
  
  // Exemplo de uso:
  const caminhoPastaAtual = dirname(process.argv[1]);
  const projectDir = caminhoPastaAtual.substring(0, caminhoPastaAtual.length-16); // Substitua pelo caminho do seu projeto
  const gitRepoUrl = 'https://github.com/fulviocoelho/arch-model-repo.git'; // Substitua pelo URL do repositório Git
  const branch = 'main'; // Substitua pelo nome do branch desejado
  const pastaACopiar = 'toolbox'; // Substitua pelo nome da pasta a ser copiada
  
  // Remove a pasta temporária antes de iniciar a atualização
  const tempDir = join(projectDir, '.temp-repo');
  if (existsSync(tempDir)) {
    // Aguarda 3 segundos antes de tentar remover a pasta temporária novamente
    setTimeout(() => {
      removePastaTemp(projectDir);
    }, 3000);
  }