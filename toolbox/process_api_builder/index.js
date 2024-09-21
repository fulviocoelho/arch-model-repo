const fs = require('fs');
const YAML = require('yaml');
const path = require('path');
const ProgressBar = require('progress');
const kleur = require('kleur');

// Define a pasta raiz onde a busca recursiva será realizada
const rootDir = './API-Projects';
const outputDir = './out';

// Função para validar e criar a pasta de saída
function validateOutFolder(caminho, pasta) {
  const caminhoPasta = path.join(caminho, pasta);
  try {
    fs.accessSync(caminhoPasta, fs.constants.F_OK);
    console.log(kleur.yellow(`A pasta '${pasta}' já existe.`));
  } catch (err) {
    fs.mkdirSync(caminhoPasta, { recursive: true }, (err) => {
      if (err) {
        console.error(kleur.red(`Erro ao criar pasta: ${err}`));
      } else {
        console.log(kleur.green(`Pasta '${pasta}' criada com sucesso.`));
      }
    });
  }
}

// Função para processar um arquivo JSON
function processJsonFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Converte o objeto JSON para YAML
  const openapiYaml = convertToJsonApi(data);

  // Salva o arquivo YAML
  const relativePath = path.relative(rootDir, filePath);
  const projectFolder = path.dirname(relativePath);
  const outputFilePath = path.join(caminhoProjetoAtual, outputPasta, "API-Project", projectFolder, path.basename(filePath, '.json') + '.yaml');

  // Cria a pasta de saída se ela não existir
  fs.mkdirSync(path.dirname(outputFilePath), { recursive: true }, (err) => {
    if (err) {
      console.error(kleur.red('Erro ao criar a pasta de saída:', err));
      return;
    }
  });

  // Escreve o arquivo YAML
  fs.writeFileSync(outputFilePath, openapiYaml);
  // console.log(kleur.green(`Arquivo YAML gerado com sucesso: ${outputFilePath}`)); // Remove a mensagem de sucesso
}

// Função para converter o objeto JSON para YAML
function convertToJsonApi(apiSpec) {
  const openapiSpec = {
    openapi: '3.0.0',
    info: {
      title: apiSpec.name,
      version: '1.0.0',
      description: apiSpec.desc,
    },
    servers: [
      {
        url: apiSpec.endpoints[0].path, // Pega a base URL do primeiro endpoint
        description: 'Servidor principal',
      },
    ],
    paths: {},
  };

  const baseUrl = apiSpec.endpoints[0].path; // Armazena a base URL

  function processEndpoint(endpoint, basePath = '') {
    if (endpoint.path !== '') {
      const path = basePath + endpoint.path.replace(baseUrl, ''); // Remove a base URL do caminho
      openapiSpec.paths[path] = {};

      if (endpoint.methods) {
        endpoint.methods.forEach((method) => {
          openapiSpec.paths[path][method.method.toLowerCase()] = {
            summary: method.desc,
            description: method.desc,
            parameters: [], // Array para armazenar os parâmetros de caminho
            responses: {
              '200': {
                description: 'Success',
              },
              '400': {
                description: 'Bad Request',
              },
              '500': {
                description: 'Internal Server Error',
              },
            },
          };

          // Identifica parâmetros de caminho
          const pathParams = path.match(/\{(.*?)\}/g);
          if (pathParams) {
            pathParams.forEach((param) => {
              openapiSpec.paths[path][method.method.toLowerCase()].parameters.push({
                in: 'path',
                name: param.slice(1, -1), // Remove as chaves {}
                schema: {
                  type: 'string',
                },
                required: true,
              });
            });
          }
        });
      }

      if (endpoint.endpoints) {
        endpoint.endpoints.forEach((childEndpoint) => {
          processEndpoint(childEndpoint, path + '/');
        });
      }
    }
  }

  apiSpec.endpoints.forEach((endpoint) => {
    processEndpoint(endpoint);
  });

  // Remove "" : {} de paths
  for (const path in openapiSpec.paths) {
    if (Object.keys(openapiSpec.paths[path]).length === 0) {
      delete openapiSpec.paths[path];
    }
  }

  const openapiYaml = YAML.stringify(openapiSpec);
  return openapiYaml;
}

// Função para realizar a busca recursiva de forma síncrona
function recursiveReadDirSync(dir) {
  console.log(kleur.blue(`Processando pasta: ${dir}`)); // Log da pasta atual
  const files = fs.readdirSync(dir);

  const totalArquivos = files.filter(file => path.extname(file) === '.json').length;
  const bar = new ProgressBar(kleur.cyan('[:bar] :percent :etas :current/:total :file'), {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: totalArquivos,
    // Define a função de renderização da barra de progresso
    renderThrottle: 100 // Atualiza a barra a cada 100ms
  });

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);

    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      // Se for um diretório, chama a função recursivamente
      recursiveReadDirSync(filePath);
    } else if (path.extname(file) === '.json') {
      // Se for um arquivo JSON, processa o arquivo
      processJsonFile(filePath);
      bar.tick({ file: file }); // Atualiza a barra com o nome do arquivo

      // Simula um atraso de 1 segundo
      const start = Date.now();
      while (Date.now() - start < 1000) {
        // Faz nada para simular um atraso
      }
    }
  });
}

const caminhoPastaAtual = path.dirname(process.argv[1]);
const caminhoProjetoAtual = caminhoPastaAtual.substring(0, (caminhoPastaAtual.length-28));
const outputPasta = 'out';

validateOutFolder(caminhoProjetoAtual, outputPasta);
// Inicia a busca recursiva na pasta raiz
recursiveReadDirSync(rootDir);