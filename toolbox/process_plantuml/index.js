const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const kleur = require('kleur');
const ProgressBar = require('progress');

// Função para validar e criar a pasta de saída
function validateOutFolder() {
  const caminhoPasta = path.join(caminhoProjetoAtual, outputPasta);
  fs.access(caminhoPasta, fs.constants.F_OK, (err) => {
    if (err) {
      fs.mkdir(caminhoPasta, { recursive: true }, (err) => {
        if (err) {
          console.error(kleur.red(`Erro ao criar pasta: ${err}`));
        } else {
          console.log(kleur.green(`Pasta '${outputPasta}' criada com sucesso.`));
        }
      });
    } else {
      console.log(kleur.yellow(`A pasta '${outputPasta}' já existe.`));
    }
  });
}

// Função para gerar uma imagem PNG a partir de um arquivo PlantUML
function gerarImagemPNG(arquivoPlantUML, caminhoSaida) {
  const comando = `java -jar ${caminhoPastaAtual}/plantuml-1.2024.7.jar -charset UTF-8 -tpng "${arquivoPlantUML}" -o "${caminhoProjetoAtual}/${outputPasta}/${caminhoSaida}"`;
  return new Promise((resolve, reject) => {
    exec(comando, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Função para percorrer recursivamente uma pasta e gerar imagens PNG
async function processarPasta(pasta) {
  console.log(kleur.blue(`Processando pasta: ${pasta}`));
  if (!excludedFolders.includes(pasta)) {
    const arquivos = await new Promise((resolve, reject) => {
      fs.readdir(pasta, (err, arquivos) => {
        if (err) {
          reject(err);
        } else {
          resolve(arquivos);
        }
      });
    });
    const totalArquivos = arquivos.filter(arquivo => path.extname(arquivo) === '.wsd').length;
    bar = new ProgressBar('[:bar] :percent :etas :current/:total :file', {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: totalArquivos
    });
    for (let i = 0; i < arquivos.length; i++) {
      const arquivo = arquivos[i];
      const caminhoCompleto = path.join(pasta, arquivo);
      const stats = await new Promise((resolve, reject) => {
        fs.stat(caminhoCompleto, (err, stats) => {
          if (err) {
            reject(err);
          } else {
            resolve(stats);
          }
        });
      });
      if (stats.isFile() && path.extname(caminhoCompleto) === '.wsd') {
        const nomeArquivoSaida = path.basename(caminhoCompleto, '.wsd') + '.png';
        const caminhoSaida = path.join(pasta, nomeArquivoSaida);
        bar.tick({ file: arquivo }); // Atualiza a barra com o nome do arquivo
        await gerarImagemPNG(caminhoCompleto, caminhoSaida);
      } else if (stats.isDirectory()) {
        await processarPasta(caminhoCompleto);
      }
    }
  } else {
    console.log(kleur.yellow(`Pasta '${pasta}' excluída do processamento.`));
  }
}

// Pasta raiz do projeto
const pastaRaiz = './Diagramas';
const excludedFolders = [".git", "node_modules", "Docs", "out", "SQL", "toolbox", ".husky"];
const caminhoPastaAtual = path.dirname(process.argv[1]);
const caminhoProjetoAtual = caminhoPastaAtual.substring(0, (caminhoPastaAtual.length-25));
const outputPasta = 'out';

console.log(kleur.cyan('Iniciando o processamento...'));
validateOutFolder();
processarPasta(pastaRaiz);
console.log(kleur.cyan('Processamento concluído!'));