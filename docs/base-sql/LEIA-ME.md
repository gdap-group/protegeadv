# Pacote de banco de dados — Protege ADV & Protege Empresa

Conteúdo:

| Arquivo | Para que serve |
| --- | --- |
| `00_local_auth_stub.sql` | Simula a autenticação do Supabase em um PostgreSQL comum. **Só para teste local.** Não aplicar no Supabase. |
| `01_nucleo.sql` | Núcleo mínimo: tipos, contas, usuários, grupos e permissões, etiquetas, processos, responsáveis, funções de segurança e políticas RLS. |
| `99_teste_isolamento.sql` | Testes de isolamento entre contas e de permissões. Serve de modelo para os testes dos seus módulos. |

## Como rodar (PostgreSQL 15 ou superior)

```bash
createdb protege_teste
psql -d protege_teste -v ON_ERROR_STOP=1 -f 00_local_auth_stub.sql
psql -d protege_teste -v ON_ERROR_STOP=1 -f 01_nucleo.sql
psql -d protege_teste -v ON_ERROR_STOP=1 -f 99_teste_isolamento.sql
```

Resultado esperado no final: `TODOS OS TESTES DE ISOLAMENTO PASSARAM`.

O teste cria dados fictícios; rode-o num banco de teste vazio, não no banco onde você
vai manter o seu trabalho (ou recrie o banco depois).

## Como colocar o seu módulo

1. Crie as migrations do seu módulo em arquivos numerados (por exemplo `0201_pessoas.sql`),
   a serem aplicadas depois do `01_nucleo.sql`.
2. Use as funções `conta_atual()` e `pode(modulo, acao)` nas políticas, como no núcleo.
3. Escreva testes no mesmo formato do `99_teste_isolamento.sql`.

Leia a Especificação do Banco de Dados antes de começar.
