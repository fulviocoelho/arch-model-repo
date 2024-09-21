## Repositório de Trabalhos de Arquitetura

Este repositório armazena trabalhos de arquitetura, incluindo documentação, diagramas e código-fonte de projetos de API.

### Estrutura de Pastas

O repositório é organizado da seguinte forma:

```
├── toolbox
├── Docs
├── Diagramas
│   └── Sequencia
│   └── Fluxo
│   └── C4
├── API-Projects
└── out

```

**Explicação das Pastas:**

* **toolbox**: Contém ferramentas para automatizar tarefas relacionadas à arquitetura, como processamento de diagramas PlantUML e geração de documentação OpenAPI.
* **Docs**: Contém a documentação da arquitetura, incluindo descrições de serviços, fluxos de trabalho e padrões utilizados.
* **Diagramas**: Contém os diagramas de arquitetura em PlantUML, organizados em subpastas para diagramas de sequência, fluxo e C4.
* **API-Projects**: Contém os projetos de API, organizados por serviço. Cada projeto contém o código-fonte da API.
* **out**: Pasta gerada para conter os artefatos de saída, como documentação OpenAPI e imagens para os diagramas de arquitetura.

### Comandos

Os seguintes comandos estão disponíveis:

* **build-plantuml**: Gera imagens a partir dos diagramas PlantUML.
* **build-openapi**: Gera documentação OpenAPI a partir dos projetos de API.
* **build-markdown**: Gera documentos em PDF a partir dos arquivos markdown da pasta Docs.
* **build-all**: Executa `build-plantuml`, `build-openapi` e `build-markdown`.
* **doc-catalog**: Disponibiliza um catalogo de modelos de documentações relativos a arquitetura e projetos de software.
* **diagram-catalog**: Disponibiliza um catalogo de modelos de diagramas usando plantuml.
* **api-builder**: Inicia o CLI de construção de API para criar uma nova API.
* **update**: Atualiza a toolbox de acordo com os ultimos commits deste repositorio.
* **setup**: Instala as dependências e configura o ambiente de desenvolvimento.
* **cleanup**: Todo o repositório deixando somente as ferramentas.
* **prereq-version**: Exibe as versões dos prerequisitps para o repositorio.

### Husky e Commitizen

O repositório utiliza Husky e Commitizen para reforçar o padrão de commits.

* **Husky**: Executa scripts pré-commit para garantir que os commits atendam aos padrões definidos.
* **Commitizen**: Fornece uma interface interativa para escrever mensagens de commit que sigam o padrão convencional.

### Contribuições

Contribuições são bem-vindas! Para contribuir, crie um fork deste repositório, faça suas alterações e abra um pull request.

### Licença

Este repositório é licenciado sob a licença [MIT](LICENSE).
