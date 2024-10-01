const fs = require('fs');
const path = require('path');
const kleur = require('kleur');

function listarComandos(packageJsonPath) {
  try {
    const packageJson = require(packageJsonPath);

    if (packageJson.scripts) {
      console.log(kleur.blue('Comandos disponíveis no package.json:'));
      for (const comando in packageJson.scripts) {
        console.log(kleur.cyan(`- ${comando}`));
      }
    } else {
      console.log(kleur.yellow('O arquivo package.json não possui a propriedade "scripts".'));
    }
  } catch (error) {
    console.error(kleur.red(`Erro ao ler o arquivo package.json: ${error.message}`));
  }
}

// Exemplo de uso:
const caminhoPastaAtual = path.dirname(process.argv[1]);
const projectDir = caminhoPastaAtual.substring(0, caminhoPastaAtual.length-8);
const packageJsonPath = path.join(projectDir, 'package.json');

listarComandos(packageJsonPath);