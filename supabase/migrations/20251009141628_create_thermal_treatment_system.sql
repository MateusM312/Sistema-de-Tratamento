/*
  # Sistema de Recomendação de Tratamento Térmico

  ## Descrição
  Sistema completo para recomendação de tratamentos térmicos baseado em:
  - Tipo de aço/matéria-prima
  - Condições de entrada (dureza inicial, etc.)
  - Requisitos do cliente (dureza final desejada)
  - Instruções de Trabalho (ITs) da empresa

  ## 1. Novas Tabelas

  ### `steel_types` - Tipos de Aço
  - `id` (uuid, primary key)
  - `code` (text, unique) - Código do aço (ex: "AISI 4140")
  - `name` (text) - Nome completo
  - `category` (text) - Categoria do aço
  - `composition` (jsonb) - Composição química
  - `properties` (jsonb) - Propriedades padrão
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `work_instructions` - Instruções de Trabalho (ITs)
  - `id` (uuid, primary key)
  - `it_code` (text, unique) - Código da IT
  - `title` (text) - Título da instrução
  - `description` (text) - Descrição detalhada
  - `treatment_type` (text) - Tipo de tratamento (têmpera, revenido, etc.)
  - `temperature_min` (numeric) - Temperatura mínima (°C)
  - `temperature_max` (numeric) - Temperatura máxima (°C)
  - `duration_min` (numeric) - Tempo mínimo (minutos)
  - `duration_max` (numeric) - Tempo máximo (minutos)
  - `cooling_method` (text) - Método de resfriamento
  - `applicable_steels` (text[]) - Códigos de aço aplicáveis
  - `hardness_input_min` (numeric) - Dureza mínima de entrada (HRC)
  - `hardness_input_max` (numeric) - Dureza máxima de entrada (HRC)
  - `hardness_output_min` (numeric) - Dureza mínima de saída (HRC)
  - `hardness_output_max` (numeric) - Dureza máxima de saída (HRC)
  - `special_notes` (text) - Observações especiais
  - `file_url` (text) - URL do arquivo da IT
  - `is_active` (boolean) - Se está ativa
  - `version` (text) - Versão da IT
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `recommendations` - Histórico de Recomendações
  - `id` (uuid, primary key)
  - `steel_type_id` (uuid, foreign key)
  - `work_instruction_id` (uuid, foreign key)
  - `input_hardness` (numeric) - Dureza inicial informada
  - `desired_hardness` (numeric) - Dureza desejada
  - `client_requirements` (jsonb) - Requisitos adicionais do cliente
  - `recommendation_reason` (text) - Justificativa da recomendação
  - `confidence_score` (numeric) - Score de confiança (0-100)
  - `user_name` (text) - Nome do usuário que consultou
  - `client_name` (text) - Nome do cliente
  - `piece_description` (text) - Descrição da peça
  - `created_at` (timestamptz)

  ### `feedback` - Feedback das Recomendações
  - `id` (uuid, primary key)
  - `recommendation_id` (uuid, foreign key)
  - `was_successful` (boolean) - Se o tratamento foi bem-sucedido
  - `actual_hardness` (numeric) - Dureza real obtida
  - `comments` (text) - Comentários sobre o resultado
  - `user_name` (text) - Nome do usuário que deu feedback
  - `created_at` (timestamptz)

  ### `knowledge_base` - Base de Conhecimento
  - `id` (uuid, primary key)
  - `question` (text) - Pergunta ou caso
  - `answer` (text) - Resposta ou solução
  - `category` (text) - Categoria da informação
  - `tags` (text[]) - Tags para busca
  - `related_its` (text[]) - ITs relacionadas
  - `upvotes` (integer) - Votos positivos
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Segurança (RLS)
  - Todas as tabelas têm RLS habilitado
  - Políticas de leitura pública (dados técnicos acessíveis)
  - Políticas de escrita restritas para authenticated users

  ## 3. Índices
  - Índices em campos de busca frequente
  - Índices em campos de relacionamento (foreign keys)
  - Índice GIN para arrays e jsonb

  ## 4. Notas Importantes
  - Sistema projetado para crescer com feedback incremental
  - Suporta múltiplos tipos de tratamento térmico
  - Rastreabilidade completa de recomendações
  - Base de conhecimento expansível
*/

-- Tabela de tipos de aço
CREATE TABLE IF NOT EXISTS steel_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  composition jsonb DEFAULT '{}'::jsonb,
  properties jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de Instruções de Trabalho (ITs)
CREATE TABLE IF NOT EXISTS work_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  it_code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  treatment_type text NOT NULL,
  temperature_min numeric,
  temperature_max numeric,
  duration_min numeric,
  duration_max numeric,
  cooling_method text DEFAULT '',
  applicable_steels text[] DEFAULT ARRAY[]::text[],
  hardness_input_min numeric,
  hardness_input_max numeric,
  hardness_output_min numeric,
  hardness_output_max numeric,
  special_notes text DEFAULT '',
  file_url text DEFAULT '',
  is_active boolean DEFAULT true,
  version text DEFAULT '1.0',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de recomendações
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  steel_type_id uuid REFERENCES steel_types(id),
  work_instruction_id uuid REFERENCES work_instructions(id),
  input_hardness numeric,
  desired_hardness numeric,
  client_requirements jsonb DEFAULT '{}'::jsonb,
  recommendation_reason text DEFAULT '',
  confidence_score numeric DEFAULT 0,
  user_name text DEFAULT '',
  client_name text DEFAULT '',
  piece_description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Tabela de feedback
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id uuid REFERENCES recommendations(id),
  was_successful boolean DEFAULT false,
  actual_hardness numeric,
  comments text DEFAULT '',
  user_name text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Tabela de base de conhecimento
CREATE TABLE IF NOT EXISTS knowledge_base (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text DEFAULT '',
  tags text[] DEFAULT ARRAY[]::text[],
  related_its text[] DEFAULT ARRAY[]::text[],
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_steel_types_code ON steel_types(code);
CREATE INDEX IF NOT EXISTS idx_steel_types_category ON steel_types(category);

CREATE INDEX IF NOT EXISTS idx_work_instructions_it_code ON work_instructions(it_code);
CREATE INDEX IF NOT EXISTS idx_work_instructions_treatment_type ON work_instructions(treatment_type);
CREATE INDEX IF NOT EXISTS idx_work_instructions_active ON work_instructions(is_active);
CREATE INDEX IF NOT EXISTS idx_work_instructions_applicable_steels ON work_instructions USING GIN(applicable_steels);

CREATE INDEX IF NOT EXISTS idx_recommendations_steel_type ON recommendations(steel_type_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_work_instruction ON recommendations(work_instruction_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_created ON recommendations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_recommendation ON feedback(recommendation_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_base_tags ON knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_category ON knowledge_base(category);

-- Habilitar RLS em todas as tabelas
ALTER TABLE steel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança - Leitura pública para dados técnicos
CREATE POLICY "Anyone can view steel types"
  ON steel_types FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view active work instructions"
  ON work_instructions FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view recommendations"
  ON recommendations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view feedback"
  ON feedback FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view knowledge base"
  ON knowledge_base FOR SELECT
  USING (true);

-- Políticas de escrita para usuários autenticados
CREATE POLICY "Authenticated users can insert steel types"
  ON steel_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update steel types"
  ON steel_types FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert work instructions"
  ON work_instructions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update work instructions"
  ON work_instructions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert recommendations"
  ON recommendations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can insert feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert knowledge base"
  ON knowledge_base FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update knowledge base"
  ON knowledge_base FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);