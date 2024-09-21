const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const markdownpdf = require('markdown-pdf');
const ProgressBar = require('progress');
const kleur = require('kleur');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function convertMarkdownToPdf(inputDir, outputDir) {
  const files = await readdir(inputDir);

  // Calcula o total de arquivos .md na pasta atual
  const totalArquivos = files.filter(file => path.extname(file) === '.md').length;
  let currentArquivo = 0; // Contador de arquivos processados

  // Cria a barra de progresso para a pasta atual, somente se houver arquivos
  let bar;
  if (totalArquivos > 0) {
    // console.log(); // Adiciona um "enter" antes da barra de progresso
    bar = new ProgressBar(kleur.cyan('[:bar] :percent :etas :current/:total :file'), {
      complete: '=',
      incomplete: ' ',
      width: 20,
      total: totalArquivos,
      // Define a função de renderização da barra de progresso
      renderThrottle: 100 // Atualiza a barra a cada 100ms
    });
  }

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const fileStat = await stat(filePath);

    if (fileStat.isDirectory()) {
      // Recursivamente converte arquivos dentro de subpastas
      const subOutputDir = path.join(outputDir, file);
      console.log(kleur.blue(`Processando pasta: ${file}`)); // Log da pasta atual
      await convertMarkdownToPdf(filePath, subOutputDir);
      // Reinicia o contador de arquivos e a barra de progresso para a próxima pasta
      currentArquivo = 0;
      if (bar) {
        bar.tick(0); 
      }
    } else if (path.extname(filePath) === '.md') {
      // Converte arquivos .md para PDF
      const outputPath = path.join(outputDir, file.replace('.md', '.pdf'));
      await new Promise((resolve, reject) => {
        markdownpdf({
          cssPath: 'style.css' // Caminho para o arquivo CSS para formatação
        }).from(filePath)
          .to(outputPath, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
      });
      currentArquivo++; // Incrementa o contador de arquivos
      if (bar) {
        bar.tick({ file: file }); // Atualiza a barra com o nome do arquivo
      }
    }
  }
}

const caminhoPastaAtual = path.dirname(process.argv[1]);
const caminhoProjetoAtual = caminhoPastaAtual.substring(0, (caminhoPastaAtual.length-25));
const inputDir = `${caminhoProjetoAtual}/Docs`; // Pasta de entrada
const outputDir = `${caminhoProjetoAtual}/out/Docs`; // Pasta de saída

console.log(kleur.blue(`Iniciando a conversão de arquivos Markdown para PDF em ${inputDir}`));

convertMarkdownToPdf(inputDir, outputDir)
  .then(() => {
    console.log(kleur.green('Conversão concluída!'));
  })
  .catch(err => {
    console.error(kleur.red('Erro durante a conversão:', err));
  });