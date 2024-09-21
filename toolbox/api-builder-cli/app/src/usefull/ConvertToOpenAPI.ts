import * as fs from 'fs';
import * as YAML from 'yaml';

interface Endpoint {
  path: string;
  endpoints?: Endpoint[];
  methods?: {
    method: string;
    desc: string;
  }[];
}

interface ApiSpec {
  name: string;
  desc: string;
  endpoints: Endpoint[];
}

function convertToJsonApi(apiSpec: ApiSpec): string {
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

  function processEndpoint(endpoint: Endpoint, basePath: string = '') {
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

// Exemplo de uso
const apiSpec: ApiSpec = {
    name: "Usuarios",
    desc: "API de CRUD para dados de usuarios",
    endpoints: [
        {
            path: "https://user.lw.com.br",
            endpoints: [
                {
                    path: "v1",
                    endpoints: [
                        {
                            path: "{user_id}",
                            methods: [
                                {
                                    method: "DELETE",
                                    desc: "Deleta o usuario"
                                },
                                {
                                    method: "GET",
                                    desc: "Retorna dados do usuario"
                                },
                                {
                                    method: "PUT",
                                    desc: "Altera dados do usuario"
                                }
                            ]
                        }
                    ],
                    methods: [
                        {
                            method: "POST",
                            desc: "Cria um novo usuario"
                        },
                        {
                            method: "GET",
                            desc: "Retorna uma lista de usuarios"
                        }
                    ]
                }
            ]
        }
    ]
};

const openapiYaml = convertToJsonApi(apiSpec);

// Salva o arquivo openapi.yaml
fs.writeFileSync('openapi.yaml', openapiYaml);

console.log('Arquivo openapi.yaml gerado com sucesso!');