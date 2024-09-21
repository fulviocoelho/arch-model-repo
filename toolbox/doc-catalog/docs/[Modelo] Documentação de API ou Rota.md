## Modelo de Documentação de API - [Nome da API/Rota]

### 1. Visão Geral

#### 1.1. Nome da API/Rota: [Nome da API/Rota]

#### 1.2. Descrição:

{Component base description}

#### 1.3. Callers:

| Callers | Descrição |
|---|---|
| SQS | Fila de Mensagens |
| API | Chamadas de API |

### 2. Detalhes Técnicos

#### 2.1. Implementação

* **Linguagem de Programação:** {Programming Language Expected to be Used on this Component}
* **Tipo de Banco de Dados:** {The database type, it would be MongoDb, DynamoDB or MySql(Aurora) for now}
* **Elastic Container Registry (ECR):** {Repository where container Image is stored, runtime Fargate uses ECR}
* **Cluster Name:** {Logical grouping of tasks or services from microservice, runtime Fargate uses Cluster}
* **Task Definition Name:** {Run docker container name, runtime Fargate uses Task Definition}
* **Resource Name:** {Searchable name from console}
* **Runtime:** {On what kind of computable runtime it runs, ECS, EC2 or Lambda}
* **Tags:**
    - v2_stage: !Ref Stage
    - v2_tenant: !Ref Tenant
    - v2_microservice: {micro-service-name}
    - v2_epic: {epic-card-name}
    - v2_feature: {feature-card-name}
    - v2_project: core or btg-layer
    - v1_ecs_recourse_type: service or task

#### 2.2. Diagrama de Arquitetura

{Component Diagram for Architectural Overview}

### 3. Interações

#### 3.1. Chamadas de API

##### 3.1.1. APIs

* **URL:** {APIMethod} {APIUrl}
* **Requisição:**
    * **Body:** {body expected for api}

##### 3.1.2. Filas de Mensagens (SQS)

* **Nome da Fila:** {QueueName}
* **Requisição:**
    * **Body:** {body expected for queue}

#### 3.2. Chamadas Recebidas

##### 3.2.1. APIs

* **Localização:** {if its a internal or external resource, if its internal the micro service and component name}
* **URL:** {APIMethod} {APIUrl}

##### 3.2.2. Filas de Mensagens (SQS)

* **Localização:** {if its a internal or external resource, if its internal the micro service and component name}
* **Nome da Fila:** {QueueName}

### 4. Banco de Dados

#### 4.1. Tabela: {TableName}

* **Descrição:** {What it should contain}

### 5. Respostas

#### 5.1. Respostas de Sucesso

* **Código de Status:** {status code}
* **Descrição:** {What happens for this result to be returned}
* **Retorno:**
    * **Body:** {Expected return body}

#### 5.2. Respostas de Erro

* **Código de Status:** {status code}
* **Descrição:** {What happens for this result to be returned}

### 6. Segurança

* **Autenticação:** [Descreva o mecanismo de autenticação utilizado]
* **Autorização:** [Descreva o mecanismo de autorização utilizado]

### 7. Monitoramento e Logs

* **Monitoramento:** [Descreva as ferramentas e métricas utilizadas para monitorar a API]
* **Logs:** [Descreva o sistema de logs utilizado e os tipos de informações registradas]

### 8. Histórico de Versões

| Data | Versão | Descrição | Autor |
|---|---|---|---|
| [Data] | [Versão] | [Descrição da alteração] | [Nome do Autor] |

### 9. Contatos

* **Tech Lead:** [Nome do Tech Lead]
* **Equipe de Desenvolvimento:** [Lista dos membros da equipe de desenvolvimento]

**Observações:**

* Este documento é um modelo e deve ser adaptado de acordo com as necessidades específicas da API.
* É importante manter a documentação atualizada com as alterações na API.
* A documentação deve ser clara, concisa e fácil de entender.
