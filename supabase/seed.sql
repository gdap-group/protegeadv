-- supabase/seed.sql
-- Dados de teste para ambiente local e homologação do Protege ADV & Protege Empresa.
-- Popula 2 contas fictícias:
-- 1. Conta Escritório: 'Silva & Santos Advogados Associados' (tipo: escritorio)
-- 2. Conta Empresa: 'Indústrias Vanguarda S.A.' (tipo: empresa)
-- Cada conta contém 3 usuários, 20 processos com números CNJ válidos (20 dígitos),
-- andamentos, publicações e registros em todas as 30 tabelas do banco de dados.

begin;

-- ---------------------------------------------------------------------------
-- 1. Limpeza de dados de seed anteriores (idempotência)
-- ---------------------------------------------------------------------------
delete from contrato_processos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from contrato_partes where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from contratos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from compromisso_envolvidos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from compromissos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from feriados where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from pessoa_outros_nomes where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from pessoa_contatos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
update partes_processo set pessoa_id = null where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
update empresas_monitoradas set pessoa_id = null where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from pessoas where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from consultas_externas where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from registro_atividade where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from registro_acesso where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from preferencias_aviso where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from avisos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from ged_versoes where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from ged_arquivos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from ged_pastas where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from modelos_documento where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from distribuicoes where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from publicacao_termos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from publicacoes where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from termo_vigiado_destinatarios where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from termos_vigiados where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from leituras where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from pedidos_busca where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from andamentos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from partes_processo where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from campos_personalizados_valores where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from campos_personalizados where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from etiqueta_vinculos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from empresas_monitoradas where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from responsaveis_processo where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from processos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from etiquetas where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from usuario_grupos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from grupo_permissoes where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from grupos where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from usuarios where conta_id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from auth.users where id in (
  '10000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000003',
  '20000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000002',
  '20000000-0000-0000-0000-000000000003'
);
delete from contas where id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');

-- ---------------------------------------------------------------------------
-- 2. Contas
-- ---------------------------------------------------------------------------
insert into contas (id, tipo, nome, cnpj, fuso, modulos_ativos, limites, situacao) values
  (
    '11111111-1111-1111-1111-111111111111',
    'escritorio',
    'Silva & Santos Advogados Associados',
    '12345678000199',
    'America/Sao_Paulo',
    '{"processos":true,"publicacoes":true,"agenda":true,"pessoas":true,"ged":true,"contratos":true,"usuarios":true,"configuracoes":true}'::jsonb,
    '{"usuarios":10,"processos_monitorados":500,"consultas_pagas":50}'::jsonb,
    'ativa'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'empresa',
    'Indústrias Vanguarda S.A.',
    '98765432000188',
    'America/Sao_Paulo',
    '{"processos":true,"publicacoes":true,"agenda":true,"pessoas":true,"ged":true,"usuarios":true,"configuracoes":true,"empresa":true}'::jsonb,
    '{"usuarios":20,"processos_monitorados":2000,"consultas_pagas":100}'::jsonb,
    'ativa'
  );

-- ---------------------------------------------------------------------------
-- 3. Autenticação (auth.users)
-- ---------------------------------------------------------------------------
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  -- Usuários da Conta 1 (Escritório)
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carlos.silva@silvasantos.adv.br', '', now(), '{"provider":"email"}', '{"nome":"Carlos Silva"}', now(), now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mariana.santos@silvasantos.adv.br', '', now(), '{"provider":"email"}', '{"nome":"Mariana Santos"}', now(), now()),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pedro.estagiario@silvasantos.adv.br', '', now(), '{"provider":"email"}', '{"nome":"Pedro Estagiário"}', now(), now()),

  -- Usuários da Conta 2 (Empresa)
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'diretoria.juridica@vanguarda.com.br', '', now(), '{"provider":"email"}', '{"nome":"Diretoria Jurídica"}', now(), now()),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'lucas.adv@vanguarda.com.br', '', now(), '{"provider":"email"}', '{"nome":"Lucas Advogado Interno"}', now(), now()),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'auditoria@vanguarda.com.br', '', now(), '{"provider":"email"}', '{"nome":"Auditoria Externa"}', now(), now());

-- ---------------------------------------------------------------------------
-- 4. Usuários da Aplicação
-- ---------------------------------------------------------------------------
insert into usuarios (
  id, conta_id, nome, email, whatsapp, whatsapp_confirmado, oab_numero, oab_uf,
  verificacao_dois_passos, ativo, perfil, restringir_a_responsavel
) values
  -- Conta 1 (Escritório)
  ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Dr. Carlos Silva', 'carlos.silva@silvasantos.adv.br', '+5511999990001', true, '111222', 'SP', true, true, 'dono', false),
  ('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Dra. Mariana Santos', 'mariana.santos@silvasantos.adv.br', '+5511999990002', true, '333444', 'SP', false, true, 'advogado', false),
  ('10000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'Pedro Henrique', 'pedro.estagiario@silvasantos.adv.br', '+5511999990003', false, null, null, false, true, 'estagiario', true),

  -- Conta 2 (Empresa)
  ('20000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Beatriz Vanguarda (Diretoria)', 'diretoria.juridica@vanguarda.com.br', '+5511988880001', true, null, null, true, true, 'dono', false),
  ('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Dr. Lucas Nogueira', 'lucas.adv@vanguarda.com.br', '+5511988880002', true, '555666', 'RJ', false, true, 'advogado', false),
  ('20000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'Auditoria Interna', 'auditoria@vanguarda.com.br', '+5511988880003', false, null, null, false, true, 'leitura', false);

-- ---------------------------------------------------------------------------
-- 5. Grupos e Permissões
-- ---------------------------------------------------------------------------
insert into grupos (id, conta_id, nome, descricao) values
  ('10000000-0000-0000-0000-000000000010', '11111111-1111-1111-1111-111111111111', 'Equipe Contencioso', 'Acesso completo operacional'),
  ('20000000-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'Jurídico Corporativo', 'Gestão de processos da empresa');

insert into grupo_permissoes (conta_id, grupo_id, modulo, pode_ver, pode_criar, pode_editar, pode_excluir) values
  -- Permissões Conta 1
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000010', 'processos', true, true, true, false),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000010', 'publicacoes', true, true, true, false),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000010', 'ged', true, true, true, false),

  -- Permissões Conta 2
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000010', 'processos', true, true, true, true),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000010', 'empresa', true, true, true, true),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000010', 'publicacoes', true, true, true, false);

insert into usuario_grupos (conta_id, usuario_id, grupo_id) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000010'),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000010'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000010');

-- ---------------------------------------------------------------------------
-- 6. Etiquetas
-- ---------------------------------------------------------------------------
insert into etiquetas (id, conta_id, nome, cor) values
  ('10000000-0000-0000-0000-000000000020', '11111111-1111-1111-1111-111111111111', 'Urgente', '#EF4444'),
  ('10000000-0000-0000-0000-000000000021', '11111111-1111-1111-1111-111111111111', 'Recurso Ordinário', '#8B5CF6'),
  ('20000000-0000-0000-0000-000000000020', '22222222-2222-2222-2222-222222222222', 'Tributário Estratégico', '#F59E0B'),
  ('20000000-0000-0000-0000-000000000021', '22222222-2222-2222-2222-222222222222', 'Trabalhista Filial SP', '#3B82F6');

-- ---------------------------------------------------------------------------
-- 7. Empresas Monitoradas (Protege Empresa)
-- ---------------------------------------------------------------------------
insert into empresas_monitoradas (id, conta_id, cnpj, razao_social, nome_fantasia, monitoramento_ligado, cadastro_automatico) values
  ('10000000-0000-0000-0000-000000000030', '11111111-1111-1111-1111-111111111111', '12345678000199', 'Silva & Santos Sociedade de Advogados', 'Silva & Santos', true, false),
  ('20000000-0000-0000-0000-000000000030', '22222222-2222-2222-2222-222222222222', '98765432000188', 'Indústrias Vanguarda Metalúrgica S.A.', 'Vanguarda Matriz', true, true),
  ('20000000-0000-0000-0000-000000000031', '22222222-2222-2222-2222-222222222222', '98765432000269', 'Indústrias Vanguarda Filial Campinas', 'Vanguarda Campinas', true, true);

-- ---------------------------------------------------------------------------
-- 8. Campos Personalizados e Valores
-- ---------------------------------------------------------------------------
insert into campos_personalizados (id, conta_id, entidade, nome, tipo, opcoes, obrigatorio, ordem) values
  ('10000000-0000-0000-0000-000000000040', '11111111-1111-1111-1111-111111111111', 'processo', 'Centro de Custo', 'lista', '["Contencioso SP", "Trabalhista RJ", "Tributario DF"]'::jsonb, false, 1),
  ('20000000-0000-0000-0000-000000000040', '22222222-2222-2222-2222-222222222222', 'processo', 'Probabilidade Contábil', 'lista', '["Provavel", "Possivel", "Remota"]'::jsonb, true, 1);

-- ---------------------------------------------------------------------------
-- 9. Processos (20 para Conta 1 + 20 para Conta 2 = 40 processos com CNJ de 20 dígitos)
-- ---------------------------------------------------------------------------
insert into processos (
  id, conta_id, numero_cnj, tribunal, grau, orgao, classe, assuntos,
  data_ajuizamento, status, probabilidade, valor_causa, estado_monitoramento,
  ultimo_andamento_em, observacoes
)
select
  ('11000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  '1' || lpad(i::text, 6, '0') || '2320268260100',
  'TJSP',
  '1º Grau',
  '2ª Vara Cível da Capital',
  'Procedimento Comum Cível',
  '["Obrigações", "Inadimplemento"]'::jsonb,
  date '2026-01-15' + (i * interval '3 days'),
  case when i % 5 = 0 then 'suspenso'::processo_status else 'ativo'::processo_status end,
  'provável',
  50000.00 + (i * 2500.00),
  case when i % 3 = 0 then 'aguardando_atualizacao'::monitoramento_estado else 'em_dia'::monitoramento_estado end,
  now() - (i * interval '1 day'),
  'Processo cível estratégico do escritório ' || i
from generate_series(1, 20) as i;

insert into processos (
  id, conta_id, numero_cnj, tribunal, grau, orgao, classe, assuntos,
  data_ajuizamento, status, probabilidade, valor_causa, estado_monitoramento,
  ultimo_andamento_em, observacoes
)
select
  ('22000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  '2' || lpad(i::text, 6, '0') || '2320265020100',
  'TRT2',
  '1º Grau',
  '14ª Vara do Trabalho de São Paulo',
  'Ação Trabalhista - Rito Ordinário',
  '["Horas Extras", "Adicional de Insalubridade"]'::jsonb,
  date '2026-02-01' + (i * interval '2 days'),
  case when i = 20 then 'arquivado'::processo_status else 'ativo'::processo_status end,
  'remota',
  120000.00 + (i * 5000.00),
  'em_dia'::monitoramento_estado,
  now() - (i * interval '12 hours'),
  'Reclamatória trabalhista corporativa ' || i
from generate_series(1, 20) as i;

-- ---------------------------------------------------------------------------
-- 10. Responsáveis de Processo
-- ---------------------------------------------------------------------------
insert into responsaveis_processo (conta_id, processo_id, usuario_id, papel)
select
  '11111111-1111-1111-1111-111111111111'::uuid,
  ('11000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  case when i % 2 = 0 then '10000000-0000-0000-0000-000000000002'::uuid else '10000000-0000-0000-0000-000000000001'::uuid end,
  'responsavel'::papel_processo
from generate_series(1, 20) as i;

insert into responsaveis_processo (conta_id, processo_id, usuario_id, papel)
select
  '22222222-2222-2222-2222-222222222222'::uuid,
  ('22000000-0000-0000-0000-' || lpad(i::text, 12, '0'))::uuid,
  '20000000-0000-0000-0000-000000000002'::uuid,
  'responsavel'::papel_processo
from generate_series(1, 20) as i;

-- ---------------------------------------------------------------------------
-- 11. Vínculo de Valores dos Campos Personalizados e Etiquetas
-- ---------------------------------------------------------------------------
insert into campos_personalizados_valores (conta_id, campo_id, item_id, valor) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000040', '11000000-0000-0000-0000-000000000001', 'Contencioso SP'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000040', '22000000-0000-0000-0000-000000000001', 'Provavel');

insert into etiqueta_vinculos (conta_id, etiqueta_id, item_tipo, item_id) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000020', 'processo', '11000000-0000-0000-0000-000000000001'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000020', 'processo', '22000000-0000-0000-0000-000000000001');

-- ---------------------------------------------------------------------------
-- 12. Partes do Processo
-- ---------------------------------------------------------------------------
insert into partes_processo (conta_id, processo_id, nome, polo, advogados, origem) values
  ('11111111-1111-1111-1111-111111111111', '11000000-0000-0000-0000-000000000001', 'Comércio Alpha Ltda', 'ativo', '[{"nome":"Carlos Silva","oab":"111222/SP"}]'::jsonb, 'fonte'),
  ('11111111-1111-1111-1111-111111111111', '11000000-0000-0000-0000-000000000001', 'Banco Financeiro Nacional S.A.', 'passivo', '[{"nome":"Advogado do Banco","oab":"999888/SP"}]'::jsonb, 'fonte'),
  ('22222222-2222-2222-2222-222222222222', '22000000-0000-0000-0000-000000000001', 'João da Silva Sauro', 'ativo', '[{"nome":"Patrono Reclamante","oab":"777666/SP"}]'::jsonb, 'fonte'),
  ('22222222-2222-2222-2222-222222222222', '22000000-0000-0000-0000-000000000001', 'Indústrias Vanguarda Metalúrgica S.A.', 'passivo', '[{"nome":"Lucas Nogueira","oab":"555666/RJ"}]'::jsonb, 'fonte');

-- ---------------------------------------------------------------------------
-- 13. Andamentos
-- ---------------------------------------------------------------------------
insert into andamentos (conta_id, processo_id, data_hora, codigo, descricao, grau, origem, fonte, id_externo) values
  ('11111111-1111-1111-1111-111111111111', '11000000-0000-0000-0000-000000000001', now() - interval '2 days', '60', 'Expedição de Mandado de Citação', 'G1', 'automatico', 'datajud', 'ext-and-11001-1'),
  ('11111111-1111-1111-1111-111111111111', '11000000-0000-0000-0000-000000000001', now() - interval '1 day', '85', 'Juntada de Petição de Contestação', 'G1', 'automatico', 'datajud', 'ext-and-11001-2'),
  ('22222222-2222-2222-2222-222222222222', '22000000-0000-0000-0000-000000000001', now() - interval '3 days', '500', 'Designada Audiência Una', 'G1', 'automatico', 'datajud', 'ext-and-22001-1'),
  ('22222222-2222-2222-2222-222222222222', '22000000-0000-0000-0000-000000000001', now() - interval '5 hours', null, 'Audiência realizada com êxito - aguardando laudo pericial', 'G1', 'manual', null, null);

-- ---------------------------------------------------------------------------
-- 14. Pedidos de Busca (Fila DataJud)
-- ---------------------------------------------------------------------------
insert into pedidos_busca (conta_id, processo_id, numero_cnj, estado, tentativas, resultado) values
  ('11111111-1111-1111-1111-111111111111', '11000000-0000-0000-0000-000000000001', '10000012320268260100', 'monitorando', 1, '{"status":"ok"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', '22000000-0000-0000-0000-000000000001', '20000012320265020100', 'monitorando', 1, '{"status":"ok"}'::jsonb);

-- ---------------------------------------------------------------------------
-- 15. Termos Vigiados e Destinatários
-- ---------------------------------------------------------------------------
insert into termos_vigiados (id, conta_id, tipo, valor, variacoes, palavras_ignorar, ativo, usuario_id) values
  ('10000000-0000-0000-0000-000000000050', '11111111-1111-1111-1111-111111111111', 'oab', '111222SP', '{"111.222/SP", "111222-SP"}', '{}', true, '10000000-0000-0000-0000-000000000001'),
  ('22000000-0000-0000-0000-000000000050', '22222222-2222-2222-2222-222222222222', 'cnpj', '98765432000188', '{"Vanguarda Metalurgica", "Ind. Vanguarda"}', '{"homonimo"}', true, '20000000-0000-0000-0000-000000000001');

insert into termo_vigiado_destinatarios (conta_id, termo_vigiado_id, usuario_id) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000050', '10000000-0000-0000-0000-000000000001'),
  ('22222222-2222-2222-2222-222222222222', '22000000-0000-0000-0000-000000000050', '20000000-0000-0000-0000-000000000002');

-- ---------------------------------------------------------------------------
-- 16. Publicações e Vínculos com Termos
-- ---------------------------------------------------------------------------
insert into publicacoes (
  id, conta_id, id_comunicacao, tribunal, orgao, data_disponibilizacao, tipo, teor,
  numero_cnj_citado, situacao, tipo_vinculo, processo_id
) values
  (
    '10000000-0000-0000-0000-000000000060',
    '11111111-1111-1111-1111-111111111111',
    'djen-pub-11001-01',
    'TJSP',
    '2ª Vara Cível da Capital',
    current_date,
    'Intimação',
    'Fica a parte autora intimada para manifestar-se sobre a contestação no prazo de 15 dias.',
    '10000012320268260100',
    'nova',
    'automatico',
    '11000000-0000-0000-0000-000000000001'
  ),
  (
    '20000000-0000-0000-0000-000000000060',
    '22222222-2222-2222-2222-222222222222',
    'djen-pub-22001-01',
    'TRT2',
    '14ª Vara do Trabalho de São Paulo',
    current_date,
    'Notificação',
    'Fica a reclamada intimada para apresentar quesitos e indicar assistente técnico.',
    '20000012320265020100',
    'nova',
    'automatico',
    '22000000-0000-0000-0000-000000000001'
  );

insert into publicacao_termos (conta_id, publicacao_id, termo_vigiado_id) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000060', '10000000-0000-0000-0000-000000000050'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000060', '22000000-0000-0000-0000-000000000050');

-- ---------------------------------------------------------------------------
-- 17. Distribuições Eletrônicas
-- ---------------------------------------------------------------------------
insert into distribuicoes (conta_id, numero_cnj, tribunal, data, termo_vigiado_id, situacao) values
  ('11111111-1111-1111-1111-111111111111', '10009992320268260100', 'TJSP', current_date, '10000000-0000-0000-0000-000000000050', 'caixa'),
  ('22222222-2222-2222-2222-222222222222', '20009992320265020100', 'TRT2', current_date, '22000000-0000-0000-0000-000000000050', 'caixa');

-- ---------------------------------------------------------------------------
-- 18. Leituras
-- ---------------------------------------------------------------------------
insert into leituras (conta_id, item_tipo, item_id, usuario_id) values
  ('11111111-1111-1111-1111-111111111111', 'andamento', (select id from andamentos where conta_id = '11111111-1111-1111-1111-111111111111' limit 1), '10000000-0000-0000-0000-000000000001'),
  ('22222222-2222-2222-2222-222222222222', 'andamento', (select id from andamentos where conta_id = '22222222-2222-2222-2222-222222222222' limit 1), '20000000-0000-0000-0000-000000000002');

-- ---------------------------------------------------------------------------
-- 19. GED: Pastas, Arquivos e Versões
-- ---------------------------------------------------------------------------
insert into ged_pastas (id, conta_id, nome, processo_id, item_tipo) values
  ('10000000-0000-0000-0000-000000000070', '11111111-1111-1111-1111-111111111111', 'Documentos - 10000012320268260100', '11000000-0000-0000-0000-000000000001', 'processo'),
  ('20000000-0000-0000-0000-000000000070', '22222222-2222-2222-2222-222222222222', 'Documentos - 20000012320265020100', '22000000-0000-0000-0000-000000000001', 'processo');

insert into ged_arquivos (id, conta_id, pasta_id, processo_id, nome, caminho_storage, tamanho_bytes, tipo_mime, enviado_por, versao_atual) values
  ('10000000-0000-0000-0000-000000000080', '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000070', '11000000-0000-0000-0000-000000000001', 'peticao_inicial.pdf', 'contas/1111/processos/11001/peticao_inicial.pdf', 245000, 'application/pdf', '10000000-0000-0000-0000-000000000001', 1),
  ('20000000-0000-0000-0000-000000000080', '22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000070', '22000000-0000-0000-0000-000000000001', 'defesa_trabalhista.pdf', 'contas/2222/processos/22001/defesa_trabalhista.pdf', 380000, 'application/pdf', '20000000-0000-0000-0000-000000000002', 1);

insert into ged_versoes (conta_id, arquivo_id, versao, caminho_storage, tamanho_bytes, enviado_por) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000080', 1, 'contas/1111/processos/11001/peticao_inicial_v1.pdf', 245000, '10000000-0000-0000-0000-000000000001'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000080', 1, 'contas/2222/processos/22001/defesa_trabalhista_v1.pdf', 380000, '20000000-0000-0000-0000-000000000002');

-- ---------------------------------------------------------------------------
-- 20. Modelos de Documento
-- ---------------------------------------------------------------------------
insert into modelos_documento (conta_id, nome, tipo, modulo, proprietario, conteudo, variaveis) values
  ('11111111-1111-1111-1111-111111111111', 'Procuração Ad Judicia Padrão', 'procuracao', 'ged', 'conta', 'OUTORGANTE: {{nome_cliente}}, CPF: {{cpf_cliente}}... outorga amplos poderes aos advogados...', '["nome_cliente","cpf_cliente","oab_advogado"]'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'Termo de Notificação Trabalhista Interna', 'outro', 'ged', 'conta', 'NOTIFICAÇÃO INTERNA: Processo {{numero_cnj}} distribuído perante a {{orgao}}...', '["numero_cnj","orgao","autor"]'::jsonb);

-- ---------------------------------------------------------------------------
-- 21. Avisos e Preferências de Notificação
-- ---------------------------------------------------------------------------
insert into avisos (conta_id, usuario_id, evento, canal, estado, titulo, mensagem, referencia_tipo, referencia_id) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'publicacao_nova', 'whatsapp', 'entregue', 'Nova Publicação DJEN', 'Publicação recebida no processo 10000012320268260100', 'publicacao', '10000000-0000-0000-0000-000000000060'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000002', 'andamento_novo', 'sistema', 'lido', 'Novo Andamento TRT2', 'Designada Audiência no processo 20000012320265020100', 'andamento', (select id from andamentos where conta_id = '22222222-2222-2222-2222-222222222222' limit 1));

insert into preferencias_aviso (conta_id, usuario_id, evento, canais, silencio_inicio, silencio_fim) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'publicacao_nova', '{whatsapp,sistema}', '22:00', '07:00'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000002', 'andamento_novo', '{email,sistema}', null, null);

-- ---------------------------------------------------------------------------
-- 22. Consultas Externas, Registro de Atividades e Acessos
-- ---------------------------------------------------------------------------
insert into consultas_externas (conta_id, fonte, alvo, duracao_ms, resultado, detalhes) values
  ('11111111-1111-1111-1111-111111111111', 'datajud', '10000012320268260100', 340, 'sucesso', '{"movimentos_encontrados":2}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'djen', '98765432000188', 850, 'sucesso', '{"publicacoes_encontradas":1}'::jsonb);

insert into registro_atividade (conta_id, usuario_id, acao, entidade, entidade_id, detalhes) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'criar', 'processo', '11000000-0000-0000-0000-000000000001', '{"numero_cnj":"10000012320268260100"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000001', 'criar', 'empresa_monitorada', '20000000-0000-0000-0000-000000000030', '{"cnpj":"98765432000188"}'::jsonb);

insert into registro_acesso (conta_id, usuario_id, email, ip, resultado) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'carlos.silva@silvasantos.adv.br', '189.100.20.15', 'sucesso'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000002', 'lucas.adv@vanguarda.com.br', '201.55.10.88', 'sucesso');

-- ---------------------------------------------------------------------------
-- 23. Pessoas, Contatos e Outros Nomes
-- ---------------------------------------------------------------------------
insert into pessoas (id, conta_id, tipo, nome, nome_fantasia, cpf_cnpj, perfis, dados_pf, observacoes) values
  -- Conta 1 (Escritório)
  (
    '10000000-0000-0000-0000-000000000101',
    '11111111-1111-1111-1111-111111111111',
    'pf',
    'João da Silva Sauro',
    null,
    '12345678901',
    '{cliente}',
    '{"mae":"Maria Sauro","pai":"José Sauro","profissao":"Engenheiro","estado_civil":"Casado"}'::jsonb,
    'Cliente prioritário do contencioso cível.'
  ),
  (
    '10000000-0000-0000-0000-000000000102',
    '11111111-1111-1111-1111-111111111111',
    'pj',
    'Banco do Brasil S.A.',
    'Banco do Brasil',
    '00000000000191',
    '{parte_contraria}',
    '{}'::jsonb,
    'Instituição financeira ré em ações revisionais.'
  ),
  (
    '10000000-0000-0000-0000-000000000103',
    '11111111-1111-1111-1111-111111111111',
    'pf',
    'Maria de Lourdes Santos',
    null,
    '98765432100',
    '{cliente}',
    '{"mae":"Ana Santos","profissao":"Médica","estado_civil":"Solteira"}'::jsonb,
    'Ação de cobrança de honorários médicos.'
  ),
  -- Conta 2 (Empresa)
  (
    '20000000-0000-0000-0000-000000000101',
    '22222222-2222-2222-2222-222222222222',
    'pf',
    'Carlos Eduardo Pereira',
    null,
    '11122233344',
    '{parte_contraria}',
    '{"profissao":"Operador de Logística"}'::jsonb,
    'Reclamante em ação trabalhista contra a empresa.'
  ),
  (
    '20000000-0000-0000-0000-000000000102',
    '22222222-2222-2222-2222-222222222222',
    'pj',
    'Transportadora Rápido Sol Ltda',
    'Rápido Sol Log',
    '22333444000155',
    '{cliente,outro}',
    '{}'::jsonb,
    'Fornecedor e parceiro estratégico de fretes.'
  ),
  (
    '20000000-0000-0000-0000-000000000103',
    '22222222-2222-2222-2222-222222222222',
    'pf',
    'Dra. Juliana Mendes',
    null,
    '55566677788',
    '{advogado}',
    '{"oab":"123456/SP"}'::jsonb,
    'Patrona externa acompanhando defesas estratégicas.'
  );

insert into pessoa_contatos (conta_id, pessoa_id, tipo, valor, rotulo, is_whatsapp) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000101', 'whatsapp', '11999990001', 'Celular pessoal', true),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000101', 'email', 'joao.sauro@email.com', 'Comercial', false),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000103', 'whatsapp', '11988880002', 'Celular', true),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000101', 'email', 'carlos.pereira@trabalho.com', 'Principal', false),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000102', 'telefone', '1133334444', 'Sede', false);

insert into pessoa_outros_nomes (conta_id, pessoa_id, nome) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000101', 'João Silva Sauro'),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000102', 'Banco do Brasil'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000102', 'Rapido Sol Transportes');

-- Atualização das FKs com as pessoas criadas
update partes_processo set pessoa_id = '10000000-0000-0000-0000-000000000101'
 where conta_id = '11111111-1111-1111-1111-111111111111'
   and processo_id = '11000000-0000-0000-0000-000000000001'
   and polo = 'ativo';

update partes_processo set pessoa_id = '20000000-0000-0000-0000-000000000101'
 where conta_id = '22222222-2222-2222-2222-222222222222'
   and processo_id = '22000000-0000-0000-0000-000000000001'
   and polo = 'ativo';

update empresas_monitoradas set pessoa_id = '20000000-0000-0000-0000-000000000102'
 where conta_id = '22222222-2222-2222-2222-222222222222';

-- ---------------------------------------------------------------------------
-- 24. Agenda: Feriados, Compromissos e Envolvidos
-- ---------------------------------------------------------------------------
insert into feriados (conta_id, data, descricao, abrangencia, uf) values
  ('11111111-1111-1111-1111-111111111111', '2026-01-01', 'Confraternização Universal', 'nacional', null),
  ('11111111-1111-1111-1111-111111111111', '2026-04-21', 'Tiradentes', 'nacional', null),
  ('11111111-1111-1111-1111-111111111111', '2026-05-01', 'Dia do Trabalho', 'nacional', null),
  ('11111111-1111-1111-1111-111111111111', '2026-07-09', 'Revolução Constitucionalista', 'estadual', 'SP'),
  ('11111111-1111-1111-1111-111111111111', '2026-11-15', 'Proclamação da República', 'nacional', null),
  ('22222222-2222-2222-2222-222222222222', '2026-01-01', 'Confraternização Universal', 'nacional', null),
  ('22222222-2222-2222-2222-222222222222', '2026-05-01', 'Dia do Trabalho', 'nacional', null),
  ('22222222-2222-2222-2222-222222222222', '2026-11-15', 'Proclamação da República', 'nacional', null);

insert into compromissos (id, conta_id, processo_id, tipo, status, titulo, descricao, data_hora_inicio, data_hora_fim, dia_inteiro) values
  -- Conta 1 (Escritório): compromissos vinculados a processos
  (
    '10000000-0000-0000-0000-000000000120',
    '11111111-1111-1111-1111-111111111111',
    '11000000-0000-0000-0000-000000000001',
    'prazo',
    'pendente',
    'Prazo: Contestação Cível',
    'Apresentar peça de contestação com preliminares de mérito.',
    '2026-11-10 18:00:00-03',
    '2026-11-10 18:00:00-03',
    false
  ),
  (
    '10000000-0000-0000-0000-000000000121',
    '11111111-1111-1111-1111-111111111111',
    '11000000-0000-0000-0000-000000000002',
    'audiencia',
    'pendente',
    'Audiência de Conciliação e Saneamento',
    'Audiência virtual perante a 2ª Vara Cível da Capital.',
    '2026-11-18 14:00:00-03',
    '2026-11-18 15:30:00-03',
    false
  ),
  -- Conta 2 (Empresa): compromissos vinculados a processos
  (
    '20000000-0000-0000-0000-000000000120',
    '22222222-2222-2222-2222-222222222222',
    '22000000-0000-0000-0000-000000000001',
    'audiencia',
    'pendente',
    'Audiência Trabalhista Telepresencial',
    'Oitiva das testemunhas e preposto da reclamada.',
    '2026-11-12 10:00:00-03',
    '2026-11-12 11:30:00-03',
    false
  ),
  (
    '20000000-0000-0000-0000-000000000121',
    '22222222-2222-2222-2222-222222222222',
    '22000000-0000-0000-0000-000000000002',
    'prazo',
    'pendente',
    'Prazo: Recurso Ordinário Trabalhista',
    'Protocolar recurso ordinário contra sentença procedente em parte.',
    '2026-11-16 23:59:00-03',
    '2026-11-16 23:59:00-03',
    false
  );

insert into compromisso_envolvidos (conta_id, compromisso_id, usuario_id, papel) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000120', '10000000-0000-0000-0000-000000000001', 'responsavel'),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000121', '10000000-0000-0000-0000-000000000002', 'responsavel'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000120', '20000000-0000-0000-0000-000000000002', 'responsavel'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000121', '20000000-0000-0000-0000-000000000002', 'responsavel');

-- ---------------------------------------------------------------------------
-- 25. Contratos: Contratos de Honorários, Partes e Vínculos com Processos
-- ---------------------------------------------------------------------------
insert into contratos (id, conta_id, codigo, descricao, situacao, data_inicio, data_fim, renovacao_automatica, valor) values
  -- Conta 1 (Escritório) - Contrato 1
  (
    '10000000-0000-0000-0000-000000000130',
    '11111111-1111-1111-1111-111111111111',
    'HON-2026-001',
    'Contrato de Prestação de Serviços Advocatícios - Contencioso Cível João Sauro',
    'ativo',
    '2026-01-10',
    '2027-01-09',
    true,
    15000.00
  ),
  -- Conta 1 (Escritório) - Contrato 2
  (
    '10000000-0000-0000-0000-000000000131',
    '11111111-1111-1111-1111-111111111111',
    'HON-2026-002',
    'Contrato de Honorários Médicos e Assessoria Jurídica Dra. Maria Lourdes',
    'ativo',
    '2026-03-01',
    '2027-02-28',
    false,
    28000.00
  ),
  -- Conta 2 (Empresa) - Contrato 1
  (
    '20000000-0000-0000-0000-000000000130',
    '22222222-2222-2222-2222-222222222222',
    'CTR-EMP-2026-01',
    'Contrato de Prestação de Serviços e Logística Rápido Sol',
    'ativo',
    '2026-01-01',
    '2026-12-31',
    true,
    50000.00
  ),
  -- Conta 2 (Empresa) - Contrato 2
  (
    '20000000-0000-0000-0000-000000000131',
    '22222222-2222-2222-2222-222222222222',
    'CTR-EMP-2026-02',
    'Assessoria Jurídica Externa Contencioso Estratégico',
    'ativo',
    '2026-02-15',
    '2027-02-14',
    false,
    35000.00
  );

insert into contrato_partes (conta_id, contrato_id, pessoa_id, usuario_id, papel) values
  -- Conta 1
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000130', '10000000-0000-0000-0000-000000000101', null, 'contratante'),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000130', null, '10000000-0000-0000-0000-000000000001', 'contratado'),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000131', '10000000-0000-0000-0000-000000000103', null, 'contratante'),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000131', null, '10000000-0000-0000-0000-000000000002', 'responsavel'),
  -- Conta 2
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000130', '20000000-0000-0000-0000-000000000102', null, 'contratante'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000130', null, '20000000-0000-0000-0000-000000000001', 'responsavel'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000131', '20000000-0000-0000-0000-000000000103', null, 'contratado'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000131', null, '20000000-0000-0000-0000-000000000002', 'responsavel');

insert into contrato_processos (conta_id, contrato_id, processo_id) values
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000130', '11000000-0000-0000-0000-000000000001'),
  ('11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000131', '11000000-0000-0000-0000-000000000002'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000130', '22000000-0000-0000-0000-000000000001'),
  ('22222222-2222-2222-2222-222222222222', '20000000-0000-0000-0000-000000000131', '22000000-0000-0000-0000-000000000002');

commit;
