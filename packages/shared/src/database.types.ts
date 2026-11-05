export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      andamentos: {
        Row: {
          id: string
          conta_id: string
          processo_id: string
          data_hora: string
          codigo: string | null
          descricao: string
          grau: string | null
          origem: Database["public"]["Enums"]["andamento_origem"]
          fonte: string | null
          id_externo: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          processo_id: string
          data_hora: string
          codigo?: string | null
          descricao: string
          grau?: string | null
          origem?: Database["public"]["Enums"]["andamento_origem"]
          fonte?: string | null
          id_externo?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          processo_id?: string
          data_hora?: string
          codigo?: string | null
          descricao?: string
          grau?: string | null
          origem?: Database["public"]["Enums"]["andamento_origem"]
          fonte?: string | null
          id_externo?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "andamentos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "andamentos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      avisos: {
        Row: {
          id: string
          conta_id: string
          usuario_id: string
          evento: string
          canal: Database["public"]["Enums"]["aviso_canal"]
          estado: Database["public"]["Enums"]["aviso_estado"]
          titulo: string | null
          mensagem: string | null
          referencia_tipo: string | null
          referencia_id: string | null
          erro: string | null
          enviado_em: string
          entregue_em: string | null
          lido_em: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          usuario_id: string
          evento: string
          canal: Database["public"]["Enums"]["aviso_canal"]
          estado?: Database["public"]["Enums"]["aviso_estado"]
          titulo?: string | null
          mensagem?: string | null
          referencia_tipo?: string | null
          referencia_id?: string | null
          erro?: string | null
          enviado_em?: string
          entregue_em?: string | null
          lido_em?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          usuario_id?: string
          evento?: string
          canal?: Database["public"]["Enums"]["aviso_canal"]
          estado?: Database["public"]["Enums"]["aviso_estado"]
          titulo?: string | null
          mensagem?: string | null
          referencia_tipo?: string | null
          referencia_id?: string | null
          erro?: string | null
          enviado_em?: string
          entregue_em?: string | null
          lido_em?: string | null
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "avisos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avisos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      campos_personalizados: {
        Row: {
          id: string
          conta_id: string
          entidade: string
          nome: string
          tipo: string
          opcoes: Json
          obrigatorio: boolean
          ordem: number
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          entidade: string
          nome: string
          tipo: string
          opcoes?: Json
          obrigatorio?: boolean
          ordem?: number
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          entidade?: string
          nome?: string
          tipo?: string
          opcoes?: Json
          obrigatorio?: boolean
          ordem?: number
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "campos_personalizados_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      campos_personalizados_valores: {
        Row: {
          id: string
          conta_id: string
          campo_id: string
          item_id: string
          valor: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          campo_id: string
          item_id: string
          valor?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          campo_id?: string
          item_id?: string
          valor?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "campos_personalizados_valores_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campos_personalizados_valores_campo_id_fkey"
            columns: ["campo_id"]
            isOneToOne: false
            referencedRelation: "campos_personalizados"
            referencedColumns: ["id"]
          },
        ]
      }
      compromisso_envolvidos: {
        Row: {
          id: string
          conta_id: string
          compromisso_id: string
          usuario_id: string
          papel: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          compromisso_id: string
          usuario_id: string
          papel?: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          compromisso_id?: string
          usuario_id?: string
          papel?: string
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "compromisso_envolvidos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compromisso_envolvidos_compromisso_id_fkey"
            columns: ["compromisso_id"]
            isOneToOne: false
            referencedRelation: "compromissos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compromisso_envolvidos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      compromissos: {
        Row: {
          id: string
          conta_id: string
          processo_id: string | null
          publicacao_id: string | null
          tipo: Database["public"]["Enums"]["compromisso_tipo"]
          status: Database["public"]["Enums"]["compromisso_status"]
          titulo: string
          descricao: string | null
          data_hora_inicio: string
          data_hora_fim: string | null
          dia_inteiro: boolean
          origem: string
          recorrencia: Json | null
          lembretes: Json
          concluido_em: string | null
          concluido_por: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          processo_id?: string | null
          publicacao_id?: string | null
          tipo?: Database["public"]["Enums"]["compromisso_tipo"]
          status?: Database["public"]["Enums"]["compromisso_status"]
          titulo: string
          descricao?: string | null
          data_hora_inicio: string
          data_hora_fim?: string | null
          dia_inteiro?: boolean
          origem?: string
          recorrencia?: Json | null
          lembretes?: Json
          concluido_em?: string | null
          concluido_por?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          processo_id?: string | null
          publicacao_id?: string | null
          tipo?: Database["public"]["Enums"]["compromisso_tipo"]
          status?: Database["public"]["Enums"]["compromisso_status"]
          titulo?: string
          descricao?: string | null
          data_hora_inicio?: string
          data_hora_fim?: string | null
          dia_inteiro?: boolean
          origem?: string
          recorrencia?: Json | null
          lembretes?: Json
          concluido_em?: string | null
          concluido_por?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "compromissos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compromissos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compromissos_publicacao_id_fkey"
            columns: ["publicacao_id"]
            isOneToOne: false
            referencedRelation: "publicacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compromissos_concluido_por_fkey"
            columns: ["concluido_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      consultas_externas: {
        Row: {
          id: string
          conta_id: string
          fonte: string
          alvo: string
          inicio: string
          duracao_ms: number | null
          resultado: string
          detalhes: Json
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          fonte: string
          alvo: string
          inicio?: string
          duracao_ms?: number | null
          resultado: string
          detalhes?: Json
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          fonte?: string
          alvo?: string
          inicio?: string
          duracao_ms?: number | null
          resultado?: string
          detalhes?: Json
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultas_externas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      contas: {
        Row: {
          id: string
          tipo: Database["public"]["Enums"]["conta_tipo"]
          nome: string
          cnpj: string | null
          fuso: string
          modulos_ativos: Json
          limites: Json
          situacao: Database["public"]["Enums"]["conta_situacao"]
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          tipo: Database["public"]["Enums"]["conta_tipo"]
          nome: string
          cnpj?: string | null
          fuso?: string
          modulos_ativos?: Json
          limites?: Json
          situacao?: Database["public"]["Enums"]["conta_situacao"]
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          tipo?: Database["public"]["Enums"]["conta_tipo"]
          nome?: string
          cnpj?: string | null
          fuso?: string
          modulos_ativos?: Json
          limites?: Json
          situacao?: Database["public"]["Enums"]["conta_situacao"]
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
        ]
      }
      contrato_partes: {
        Row: {
          id: string
          conta_id: string
          contrato_id: string
          pessoa_id: string | null
          usuario_id: string | null
          papel: Database["public"]["Enums"]["contrato_parte_papel"]
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          contrato_id: string
          pessoa_id?: string | null
          usuario_id?: string | null
          papel?: Database["public"]["Enums"]["contrato_parte_papel"]
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          contrato_id?: string
          pessoa_id?: string | null
          usuario_id?: string | null
          papel?: Database["public"]["Enums"]["contrato_parte_papel"]
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrato_partes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrato_partes_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrato_partes_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrato_partes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      contrato_processos: {
        Row: {
          id: string
          conta_id: string
          contrato_id: string
          processo_id: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          contrato_id: string
          processo_id: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          contrato_id?: string
          processo_id?: string
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "contrato_processos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrato_processos_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contrato_processos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          id: string
          conta_id: string
          codigo: string
          descricao: string | null
          situacao: Database["public"]["Enums"]["contrato_situacao"]
          data_inicio: string
          data_fim: string | null
          renovacao_automatica: boolean
          arquivo_id: string | null
          excluido_em: string | null
          criado_em: string
          atualizado_em: string
          criado_por: string | null
        }
        Insert: {
          id?: string
          conta_id: string
          codigo: string
          descricao?: string | null
          situacao?: Database["public"]["Enums"]["contrato_situacao"]
          data_inicio: string
          data_fim?: string | null
          renovacao_automatica?: boolean
          arquivo_id?: string | null
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
          criado_por?: string | null
        }
        Update: {
          id?: string
          conta_id?: string
          codigo?: string
          descricao?: string | null
          situacao?: Database["public"]["Enums"]["contrato_situacao"]
          data_inicio?: string
          data_fim?: string | null
          renovacao_automatica?: boolean
          arquivo_id?: string | null
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
          criado_por?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_arquivo_id_fkey"
            columns: ["arquivo_id"]
            isOneToOne: false
            referencedRelation: "ged_arquivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      distribuicoes: {
        Row: {
          id: string
          conta_id: string
          numero_cnj: string
          tribunal: string | null
          data: string | null
          termo_vigiado_id: string | null
          situacao: Database["public"]["Enums"]["distribuicao_situacao"]
          processo_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          numero_cnj: string
          tribunal?: string | null
          data?: string | null
          termo_vigiado_id?: string | null
          situacao?: Database["public"]["Enums"]["distribuicao_situacao"]
          processo_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          numero_cnj?: string
          tribunal?: string | null
          data?: string | null
          termo_vigiado_id?: string | null
          situacao?: Database["public"]["Enums"]["distribuicao_situacao"]
          processo_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "distribuicoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribuicoes_termo_vigiado_id_fkey"
            columns: ["termo_vigiado_id"]
            isOneToOne: false
            referencedRelation: "termos_vigiados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distribuicoes_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas_monitoradas: {
        Row: {
          id: string
          conta_id: string
          cnpj: string
          razao_social: string
          nome_fantasia: string | null
          monitoramento_ligado: boolean
          cadastro_automatico: boolean
          pessoa_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          cnpj: string
          razao_social: string
          nome_fantasia?: string | null
          monitoramento_ligado?: boolean
          cadastro_automatico?: boolean
          pessoa_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          cnpj?: string
          razao_social?: string
          nome_fantasia?: string | null
          monitoramento_ligado?: boolean
          cadastro_automatico?: boolean
          pessoa_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "empresas_monitoradas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empresas_monitoradas_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      etiqueta_vinculos: {
        Row: {
          id: string
          conta_id: string
          etiqueta_id: string
          item_tipo: string
          item_id: string
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          etiqueta_id: string
          item_tipo: string
          item_id: string
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          etiqueta_id?: string
          item_tipo?: string
          item_id?: string
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "etiqueta_vinculos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etiqueta_vinculos_etiqueta_id_fkey"
            columns: ["etiqueta_id"]
            isOneToOne: false
            referencedRelation: "etiquetas"
            referencedColumns: ["id"]
          },
        ]
      }
      etiquetas: {
        Row: {
          id: string
          conta_id: string
          nome: string
          cor: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          nome: string
          cor?: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          nome?: string
          cor?: string
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "etiquetas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      feriados: {
        Row: {
          id: string
          conta_id: string
          data: string
          descricao: string
          abrangencia: string
          uf: string | null
          municipio: string | null
          tribunal: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          data: string
          descricao: string
          abrangencia?: string
          uf?: string | null
          municipio?: string | null
          tribunal?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          data?: string
          descricao?: string
          abrangencia?: string
          uf?: string | null
          municipio?: string | null
          tribunal?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "feriados_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      ged_arquivos: {
        Row: {
          id: string
          conta_id: string
          pasta_id: string | null
          processo_id: string | null
          nome: string
          caminho_storage: string
          tamanho_bytes: number
          tipo_mime: string
          enviado_por: string | null
          versao_atual: number
          excluido_em: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          pasta_id?: string | null
          processo_id?: string | null
          nome: string
          caminho_storage: string
          tamanho_bytes?: number
          tipo_mime?: string
          enviado_por?: string | null
          versao_atual?: number
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          pasta_id?: string | null
          processo_id?: string | null
          nome?: string
          caminho_storage?: string
          tamanho_bytes?: number
          tipo_mime?: string
          enviado_por?: string | null
          versao_atual?: number
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "ged_arquivos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ged_arquivos_pasta_id_fkey"
            columns: ["pasta_id"]
            isOneToOne: false
            referencedRelation: "ged_pastas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ged_arquivos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ged_arquivos_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ged_pastas: {
        Row: {
          id: string
          conta_id: string
          nome: string
          pasta_pai_id: string | null
          processo_id: string | null
          item_tipo: string | null
          item_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          nome: string
          pasta_pai_id?: string | null
          processo_id?: string | null
          item_tipo?: string | null
          item_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          nome?: string
          pasta_pai_id?: string | null
          processo_id?: string | null
          item_tipo?: string | null
          item_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "ged_pastas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ged_pastas_pasta_pai_id_fkey"
            columns: ["pasta_pai_id"]
            isOneToOne: false
            referencedRelation: "ged_pastas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ged_pastas_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      ged_versoes: {
        Row: {
          id: string
          conta_id: string
          arquivo_id: string
          versao: number
          caminho_storage: string
          tamanho_bytes: number
          enviado_por: string | null
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          arquivo_id: string
          versao: number
          caminho_storage: string
          tamanho_bytes: number
          enviado_por?: string | null
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          arquivo_id?: string
          versao?: number
          caminho_storage?: string
          tamanho_bytes?: number
          enviado_por?: string | null
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "ged_versoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ged_versoes_arquivo_id_fkey"
            columns: ["arquivo_id"]
            isOneToOne: false
            referencedRelation: "ged_arquivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ged_versoes_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_permissoes: {
        Row: {
          id: string
          conta_id: string
          grupo_id: string
          modulo: Database["public"]["Enums"]["modulo_sistema"]
          pode_ver: boolean
          pode_criar: boolean
          pode_editar: boolean
          pode_excluir: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          grupo_id: string
          modulo: Database["public"]["Enums"]["modulo_sistema"]
          pode_ver?: boolean
          pode_criar?: boolean
          pode_editar?: boolean
          pode_excluir?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          grupo_id?: string
          modulo?: Database["public"]["Enums"]["modulo_sistema"]
          pode_ver?: boolean
          pode_criar?: boolean
          pode_editar?: boolean
          pode_excluir?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_permissoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupo_permissoes_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos: {
        Row: {
          id: string
          conta_id: string
          nome: string
          descricao: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          nome: string
          descricao?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          nome?: string
          descricao?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      leituras: {
        Row: {
          id: string
          conta_id: string
          item_tipo: Database["public"]["Enums"]["leitura_item_tipo"]
          item_id: string
          usuario_id: string
          lido_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          item_tipo: Database["public"]["Enums"]["leitura_item_tipo"]
          item_id: string
          usuario_id: string
          lido_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          item_tipo?: Database["public"]["Enums"]["leitura_item_tipo"]
          item_id?: string
          usuario_id?: string
          lido_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "leituras_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leituras_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      modelos_documento: {
        Row: {
          id: string
          conta_id: string | null
          nome: string
          tipo: string
          modulo: Database["public"]["Enums"]["modulo_sistema"]
          proprietario: Database["public"]["Enums"]["modelo_proprietario"]
          conteudo: string
          variaveis: Json
          ativo: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id?: string | null
          nome: string
          tipo: string
          modulo?: Database["public"]["Enums"]["modulo_sistema"]
          proprietario?: Database["public"]["Enums"]["modelo_proprietario"]
          conteudo: string
          variaveis?: Json
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string | null
          nome?: string
          tipo?: string
          modulo?: Database["public"]["Enums"]["modulo_sistema"]
          proprietario?: Database["public"]["Enums"]["modelo_proprietario"]
          conteudo?: string
          variaveis?: Json
          ativo?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "modelos_documento_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      partes_processo: {
        Row: {
          id: string
          conta_id: string
          processo_id: string
          nome: string
          nome_manual: string | null
          polo: Database["public"]["Enums"]["parte_polo"]
          polo_manual: Database["public"]["Enums"]["parte_polo"] | null
          advogados: Json
          pessoa_id: string | null
          origem: Database["public"]["Enums"]["parte_origem"]
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          processo_id: string
          nome: string
          nome_manual?: string | null
          polo: Database["public"]["Enums"]["parte_polo"]
          polo_manual?: Database["public"]["Enums"]["parte_polo"] | null
          advogados?: Json
          pessoa_id?: string | null
          origem?: Database["public"]["Enums"]["parte_origem"]
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          processo_id?: string
          nome?: string
          nome_manual?: string | null
          polo?: Database["public"]["Enums"]["parte_polo"]
          polo_manual?: Database["public"]["Enums"]["parte_polo"] | null
          advogados?: Json
          pessoa_id?: string | null
          origem?: Database["public"]["Enums"]["parte_origem"]
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "partes_processo_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partes_processo_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partes_processo_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_busca: {
        Row: {
          id: string
          conta_id: string
          processo_id: string | null
          numero_cnj: string
          estado: Database["public"]["Enums"]["pedido_busca_estado"]
          tentativas: number
          erro: string | null
          resultado: Json
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          processo_id?: string | null
          numero_cnj: string
          estado?: Database["public"]["Enums"]["pedido_busca_estado"]
          tentativas?: number
          erro?: string | null
          resultado?: Json
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          processo_id?: string | null
          numero_cnj?: string
          estado?: Database["public"]["Enums"]["pedido_busca_estado"]
          tentativas?: number
          erro?: string | null
          resultado?: Json
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_busca_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_busca_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoa_contatos: {
        Row: {
          id: string
          conta_id: string
          pessoa_id: string
          tipo: string
          valor: string
          rotulo: string | null
          is_whatsapp: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          pessoa_id: string
          tipo: string
          valor: string
          rotulo?: string | null
          is_whatsapp?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          pessoa_id?: string
          tipo?: string
          valor?: string
          rotulo?: string | null
          is_whatsapp?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "pessoa_contatos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoa_contatos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoa_outros_nomes: {
        Row: {
          id: string
          conta_id: string
          pessoa_id: string
          nome: string
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          pessoa_id: string
          nome: string
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          pessoa_id?: string
          nome?: string
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "pessoa_outros_nomes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoa_outros_nomes_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas: {
        Row: {
          id: string
          conta_id: string
          tipo: Database["public"]["Enums"]["pessoa_tipo"]
          nome: string
          nome_fantasia: string | null
          cpf_cnpj: string | null
          perfis: Database["public"]["Enums"]["pessoa_perfil"][]
          dados_pf: Json | null
          observacoes: string | null
          excluido_em: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          tipo: Database["public"]["Enums"]["pessoa_tipo"]
          nome: string
          nome_fantasia?: string | null
          cpf_cnpj?: string | null
          perfis?: Database["public"]["Enums"]["pessoa_perfil"][]
          dados_pf?: Json | null
          observacoes?: string | null
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          tipo?: Database["public"]["Enums"]["pessoa_tipo"]
          nome?: string
          nome_fantasia?: string | null
          cpf_cnpj?: string | null
          perfis?: Database["public"]["Enums"]["pessoa_perfil"][]
          dados_pf?: Json | null
          observacoes?: string | null
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      preferencias_aviso: {
        Row: {
          id: string
          conta_id: string
          usuario_id: string
          evento: string
          canais: Database["public"]["Enums"]["aviso_canal"][]
          silencio_inicio: string | null
          silencio_fim: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          usuario_id: string
          evento: string
          canais?: Database["public"]["Enums"]["aviso_canal"][]
          silencio_inicio?: string | null
          silencio_fim?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          usuario_id?: string
          evento?: string
          canais?: Database["public"]["Enums"]["aviso_canal"][]
          silencio_inicio?: string | null
          silencio_fim?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferencias_aviso_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preferencias_aviso_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      processos: {
        Row: {
          id: string
          conta_id: string
          numero_cnj: string
          tribunal: string | null
          grau: string | null
          orgao: string | null
          orgao_manual: string | null
          classe: string | null
          classe_manual: string | null
          assuntos: Json
          data_ajuizamento: string | null
          data_ajuizamento_manual: string | null
          sigilo: number | null
          status: Database["public"]["Enums"]["processo_status"]
          probabilidade: string | null
          valor_causa: number | null
          estado_monitoramento: Database["public"]["Enums"]["monitoramento_estado"]
          nao_encontrado_na_base: boolean
          ultima_atualizacao_fonte: string | null
          ultimo_andamento_em: string | null
          observacoes: string | null
          excluido_em: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          numero_cnj: string
          tribunal?: string | null
          grau?: string | null
          orgao?: string | null
          orgao_manual?: string | null
          classe?: string | null
          classe_manual?: string | null
          assuntos?: Json
          data_ajuizamento?: string | null
          data_ajuizamento_manual?: string | null
          sigilo?: number | null
          status?: Database["public"]["Enums"]["processo_status"]
          probabilidade?: string | null
          valor_causa?: number | null
          estado_monitoramento?: Database["public"]["Enums"]["monitoramento_estado"]
          nao_encontrado_na_base?: boolean
          ultima_atualizacao_fonte?: string | null
          ultimo_andamento_em?: string | null
          observacoes?: string | null
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          numero_cnj?: string
          tribunal?: string | null
          grau?: string | null
          orgao?: string | null
          orgao_manual?: string | null
          classe?: string | null
          classe_manual?: string | null
          assuntos?: Json
          data_ajuizamento?: string | null
          data_ajuizamento_manual?: string | null
          sigilo?: number | null
          status?: Database["public"]["Enums"]["processo_status"]
          probabilidade?: string | null
          valor_causa?: number | null
          estado_monitoramento?: Database["public"]["Enums"]["monitoramento_estado"]
          nao_encontrado_na_base?: boolean
          ultima_atualizacao_fonte?: string | null
          ultimo_andamento_em?: string | null
          observacoes?: string | null
          excluido_em?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "processos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
      publicacao_termos: {
        Row: {
          id: string
          conta_id: string
          publicacao_id: string
          termo_vigiado_id: string
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          publicacao_id: string
          termo_vigiado_id: string
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          publicacao_id?: string
          termo_vigiado_id?: string
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "publicacao_termos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicacao_termos_publicacao_id_fkey"
            columns: ["publicacao_id"]
            isOneToOne: false
            referencedRelation: "publicacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicacao_termos_termo_vigiado_id_fkey"
            columns: ["termo_vigiado_id"]
            isOneToOne: false
            referencedRelation: "termos_vigiados"
            referencedColumns: ["id"]
          },
        ]
      }
      publicacoes: {
        Row: {
          id: string
          conta_id: string
          id_comunicacao: string
          tribunal: string | null
          orgao: string | null
          data_disponibilizacao: string
          tipo: string | null
          teor: string
          numero_cnj_citado: string | null
          situacao: Database["public"]["Enums"]["publicacao_situacao"]
          tipo_vinculo: Database["public"]["Enums"]["publicacao_vinculo"]
          processo_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          id_comunicacao: string
          tribunal?: string | null
          orgao?: string | null
          data_disponibilizacao: string
          tipo?: string | null
          teor: string
          numero_cnj_citado?: string | null
          situacao?: Database["public"]["Enums"]["publicacao_situacao"]
          tipo_vinculo?: Database["public"]["Enums"]["publicacao_vinculo"]
          processo_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          id_comunicacao?: string
          tribunal?: string | null
          orgao?: string | null
          data_disponibilizacao?: string
          tipo?: string | null
          teor?: string
          numero_cnj_citado?: string | null
          situacao?: Database["public"]["Enums"]["publicacao_situacao"]
          tipo_vinculo?: Database["public"]["Enums"]["publicacao_vinculo"]
          processo_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "publicacoes_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "publicacoes_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_acesso: {
        Row: {
          id: string
          conta_id: string | null
          usuario_id: string | null
          email: string
          data_hora: string
          ip: string | null
          user_agent: string | null
          resultado: string
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id?: string | null
          usuario_id?: string | null
          email: string
          data_hora?: string
          ip?: string | null
          user_agent?: string | null
          resultado: string
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string | null
          usuario_id?: string | null
          email?: string
          data_hora?: string
          ip?: string | null
          user_agent?: string | null
          resultado?: string
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "registro_acesso_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_acesso_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registro_atividade: {
        Row: {
          id: string
          conta_id: string
          usuario_id: string | null
          acao: string
          entidade: string
          entidade_id: string | null
          detalhes: Json
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          usuario_id?: string | null
          acao: string
          entidade: string
          entidade_id?: string | null
          detalhes?: Json
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          usuario_id?: string | null
          acao?: string
          entidade?: string
          entidade_id?: string | null
          detalhes?: Json
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "registro_atividade_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registro_atividade_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      responsaveis_processo: {
        Row: {
          id: string
          conta_id: string
          processo_id: string
          usuario_id: string
          papel: Database["public"]["Enums"]["papel_processo"]
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          processo_id: string
          usuario_id: string
          papel?: Database["public"]["Enums"]["papel_processo"]
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          processo_id?: string
          usuario_id?: string
          papel?: Database["public"]["Enums"]["papel_processo"]
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "responsaveis_processo_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responsaveis_processo_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responsaveis_processo_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      termo_vigiado_destinatarios: {
        Row: {
          id: string
          conta_id: string
          termo_vigiado_id: string
          usuario_id: string
          criado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          termo_vigiado_id: string
          usuario_id: string
          criado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          termo_vigiado_id?: string
          usuario_id?: string
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "termo_vigiado_destinatarios_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "termo_vigiado_destinatarios_termo_vigiado_id_fkey"
            columns: ["termo_vigiado_id"]
            isOneToOne: false
            referencedRelation: "termos_vigiados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "termo_vigiado_destinatarios_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      termos_vigiados: {
        Row: {
          id: string
          conta_id: string
          tipo: Database["public"]["Enums"]["termo_tipo"]
          valor: string
          variacoes: string[]
          palavras_ignorar: string[]
          ativo: boolean
          ultima_consulta_em: string | null
          usuario_id: string | null
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id?: string
          conta_id: string
          tipo: Database["public"]["Enums"]["termo_tipo"]
          valor: string
          variacoes?: string[]
          palavras_ignorar?: string[]
          ativo?: boolean
          ultima_consulta_em?: string | null
          usuario_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          tipo?: Database["public"]["Enums"]["termo_tipo"]
          valor?: string
          variacoes?: string[]
          palavras_ignorar?: string[]
          ativo?: boolean
          ultima_consulta_em?: string | null
          usuario_id?: string | null
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "termos_vigiados_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "termos_vigiados_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuario_grupos: {
        Row: {
          conta_id: string
          usuario_id: string
          grupo_id: string
          criado_em: string
        }
        Insert: {
          conta_id: string
          usuario_id: string
          grupo_id: string
          criado_em?: string
        }
        Update: {
          conta_id?: string
          usuario_id?: string
          grupo_id?: string
          criado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_grupos_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_grupos_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_grupos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          id: string
          conta_id: string
          nome: string
          email: string
          whatsapp: string | null
          whatsapp_confirmado: boolean
          oab_numero: string | null
          oab_uf: string | null
          verificacao_dois_passos: boolean
          ativo: boolean
          perfil: Database["public"]["Enums"]["perfil_usuario"]
          restringir_a_responsavel: boolean
          criado_em: string
          atualizado_em: string
        }
        Insert: {
          id: string
          conta_id: string
          nome: string
          email: string
          whatsapp?: string | null
          whatsapp_confirmado?: boolean
          oab_numero?: string | null
          oab_uf?: string | null
          verificacao_dois_passos?: boolean
          ativo?: boolean
          perfil?: Database["public"]["Enums"]["perfil_usuario"]
          restringir_a_responsavel?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Update: {
          id?: string
          conta_id?: string
          nome?: string
          email?: string
          whatsapp?: string | null
          whatsapp_confirmado?: boolean
          oab_numero?: string | null
          oab_uf?: string | null
          verificacao_dois_passos?: boolean
          ativo?: boolean
          perfil?: Database["public"]["Enums"]["perfil_usuario"]
          restringir_a_responsavel?: boolean
          criado_em?: string
          atualizado_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_conta_id_fkey"
            columns: ["conta_id"]
            isOneToOne: false
            referencedRelation: "contas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      conta_atual: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      perfil_atual: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["perfil_usuario"]
      }
      pode: {
        Args: {
          modulo_nome: Database["public"]["Enums"]["modulo_sistema"]
          acao: string
        }
        Returns: boolean
      }
      pode_ver_processo: {
        Args: {
          p_processo_id: string
        }
        Returns: boolean
      }
      expurgar_registros_excluidos: {
        Args: Record<PropertyKey, never>
        Returns: {
          tabela: string
          registros_excluidos: number
        }[]
      }
    }
    Enums: {
      andamento_origem: "automatico" | "manual"
      aviso_canal: "email" | "whatsapp" | "sistema"
      aviso_estado: "enviado" | "entregue" | "lido" | "falhou"
      compromisso_status: "pendente" | "em_andamento" | "concluido" | "cancelado"
      compromisso_tipo: "prazo" | "audiencia" | "atividade"
      conta_situacao: "ativa" | "suspensa" | "cancelada"
      conta_tipo: "escritorio" | "empresa"
      contrato_parte_papel: "contratante" | "contratado" | "responsavel"
      contrato_situacao: "ativo" | "vencido" | "renovado" | "encerrado" | "arquivado"
      distribuicao_situacao: "caixa" | "arquivada" | "ignorada" | "aceita"
      leitura_item_tipo: "andamento" | "publicacao"
      modelo_proprietario: "sistema" | "conta"
      modulo_sistema: "processos" | "publicacoes" | "agenda" | "pessoas" | "ged" | "contratos" | "usuarios" | "configuracoes" | "empresa"
      monitoramento_estado: "em_dia" | "aguardando_atualizacao" | "nao_monitorado"
      papel_processo: "responsavel" | "envolvido"
      parte_origem: "fonte" | "manual"
      parte_polo: "ativo" | "passivo" | "outro"
      pedido_busca_estado: "em_processamento" | "processada" | "monitorando" | "nao_monitorada" | "erro" | "arquivada"
      perfil_usuario: "dono" | "advogado" | "estagiario" | "leitura"
      pessoa_perfil: "cliente" | "parte_contraria" | "advogado" | "testemunha" | "outro" | "orgao"
      pessoa_tipo: "pf" | "pj"
      processo_status: "indefinido" | "ativo" | "suspenso" | "baixado" | "encerrado" | "arquivado"
      publicacao_situacao: "nova" | "lida" | "arquivada"
      publicacao_vinculo: "automatico" | "manual" | "nenhum"
      termo_tipo: "nome" | "advogado" | "oab" | "cnpj"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
