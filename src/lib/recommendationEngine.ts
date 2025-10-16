import { supabase, WorkInstruction } from './supabase';

export interface RecommendationRequest {
  steelCode: string;
  inputHardness?: number;
  desiredHardness?: number;
  clientRequirements?: Record<string, any>;
  pieceDescription?: string;
}

export interface RecommendationResult {
  workInstruction: WorkInstruction;
  reason: string;
  confidenceScore: number;
  matchDetails: {
    steelMatch: boolean;
    hardnessInputMatch: boolean;
    hardnessOutputMatch: boolean;
    temperatureRange?: string;
    durationRange?: string;
  };
}

export class RecommendationEngine {
  async findRecommendations(request: RecommendationRequest): Promise<RecommendationResult[]> {
    const { steelCode, inputHardness, desiredHardness } = request;

    const { data: workInstructions, error } = await supabase
      .from('work_instructions')
      .select('*')
      .eq('is_active', true);

    if (error || !workInstructions) {
      throw new Error('Erro ao buscar instruções de trabalho');
    }

    const recommendations: RecommendationResult[] = [];

    for (const wi of workInstructions) {
      const score = this.calculateScore(wi, request);

      if (score.total > 0) {
        const reason = this.generateReason(wi, request, score);

        recommendations.push({
          workInstruction: wi,
          reason,
          confidenceScore: score.total,
          matchDetails: {
            steelMatch: score.steelMatch,
            hardnessInputMatch: score.hardnessInputMatch,
            hardnessOutputMatch: score.hardnessOutputMatch,
            temperatureRange: wi.temperature_min && wi.temperature_max
              ? `${wi.temperature_min}°C - ${wi.temperature_max}°C`
              : undefined,
            durationRange: wi.duration_min && wi.duration_max
              ? `${wi.duration_min} - ${wi.duration_max} min`
              : undefined,
          },
        });
      }
    }

    recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);

    return recommendations.slice(0, 5);
  }

  private calculateScore(
    wi: WorkInstruction,
    request: RecommendationRequest
  ): {
    total: number;
    steelMatch: boolean;
    hardnessInputMatch: boolean;
    hardnessOutputMatch: boolean;
  } {
    let score = 0;
    let steelMatch = false;
    let hardnessInputMatch = false;
    let hardnessOutputMatch = false;

    if (wi.applicable_steels && wi.applicable_steels.length > 0) {
      const steelMatches = wi.applicable_steels.some(
        (steel) => steel.toLowerCase() === request.steelCode.toLowerCase()
      );
      if (steelMatches) {
        score += 40;
        steelMatch = true;
      } else {
        const partialMatch = wi.applicable_steels.some((steel) =>
          steel.toLowerCase().includes(request.steelCode.toLowerCase()) ||
          request.steelCode.toLowerCase().includes(steel.toLowerCase())
        );
        if (partialMatch) {
          score += 20;
          steelMatch = true;
        }
      }
    }

    if (request.inputHardness !== undefined && wi.hardness_input_min !== null && wi.hardness_input_max !== null) {
      if (
        request.inputHardness >= wi.hardness_input_min &&
        request.inputHardness <= wi.hardness_input_max
      ) {
        score += 25;
        hardnessInputMatch = true;
      } else {
        const diff = Math.min(
          Math.abs(request.inputHardness - wi.hardness_input_min),
          Math.abs(request.inputHardness - wi.hardness_input_max)
        );
        if (diff <= 5) {
          score += 15;
        }
      }
    }

    if (request.desiredHardness !== undefined && wi.hardness_output_min !== null && wi.hardness_output_max !== null) {
      if (
        request.desiredHardness >= wi.hardness_output_min &&
        request.desiredHardness <= wi.hardness_output_max
      ) {
        score += 35;
        hardnessOutputMatch = true;
      } else {
        const diff = Math.min(
          Math.abs(request.desiredHardness - wi.hardness_output_min),
          Math.abs(request.desiredHardness - wi.hardness_output_max)
        );
        if (diff <= 5) {
          score += 20;
        } else if (diff <= 10) {
          score += 10;
        }
      }
    }

    return {
      total: Math.min(score, 100),
      steelMatch,
      hardnessInputMatch,
      hardnessOutputMatch,
    };
  }

  private generateReason(
    wi: WorkInstruction,
    request: RecommendationRequest,
    score: {
      steelMatch: boolean;
      hardnessInputMatch: boolean;
      hardnessOutputMatch: boolean;
    }
  ): string {
    const reasons: string[] = [];

    if (score.steelMatch) {
      reasons.push(`✓ Compatível com o aço ${request.steelCode}`);
    }

    if (score.hardnessInputMatch && request.inputHardness) {
      reasons.push(`✓ Aceita dureza de entrada de ${request.inputHardness} HRC`);
    }

    if (score.hardnessOutputMatch && request.desiredHardness) {
      reasons.push(`✓ Atinge dureza desejada de ${request.desiredHardness} HRC`);
    }

    if (wi.temperature_min && wi.temperature_max) {
      reasons.push(`Temperatura: ${wi.temperature_min}°C - ${wi.temperature_max}°C`);
    }

    if (wi.cooling_method) {
      reasons.push(`Resfriamento: ${wi.cooling_method}`);
    }

    return reasons.join('\n');
  }

  async saveRecommendation(
    request: RecommendationRequest,
    result: RecommendationResult,
    userName: string,
    clientName: string
  ): Promise<string> {
    const { data: steelType } = await supabase
      .from('steel_types')
      .select('id')
      .eq('code', request.steelCode)
      .maybeSingle();

    const { data, error } = await supabase
      .from('recommendations')
      .insert({
        steel_type_id: steelType?.id,
        work_instruction_id: result.workInstruction.id,
        input_hardness: request.inputHardness,
        desired_hardness: request.desiredHardness,
        client_requirements: request.clientRequirements || {},
        recommendation_reason: result.reason,
        confidence_score: result.confidenceScore,
        user_name: userName,
        client_name: clientName,
        piece_description: request.pieceDescription || '',
      })
      .select('id')
      .single();

    if (error) {
      throw new Error('Erro ao salvar recomendação');
    }

    return data.id;
  }
}
