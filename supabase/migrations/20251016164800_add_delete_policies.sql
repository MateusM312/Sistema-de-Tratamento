/*
  # Adicionar Políticas de Exclusão

  ## Descrição
  Adiciona políticas para permitir que qualquer usuário exclua tipos de aço e instruções de trabalho.

  ## Alterações
  - Adiciona política DELETE para steel_types
  - Adiciona política DELETE para work_instructions
  - Permite que qualquer pessoa exclua registros para facilitar gerenciamento
*/

-- Políticas de exclusão para tipos de aço
CREATE POLICY "Anyone can delete steel types"
  ON steel_types FOR DELETE
  USING (true);

-- Políticas de exclusão para instruções de trabalho
CREATE POLICY "Anyone can delete work instructions"
  ON work_instructions FOR DELETE
  USING (true);
