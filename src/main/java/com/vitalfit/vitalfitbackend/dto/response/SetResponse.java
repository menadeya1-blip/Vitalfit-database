package com.vitalfit.vitalfitbackend.dto.response;

import com.vitalfit.vitalfitbackend.domain.model.WorkoutSet;

import java.math.BigDecimal;

public record SetResponse(Long id, Long sessionId, Long exerciseId, Integer setNumber, BigDecimal weightKg, Integer reps) {

    public static SetResponse from(WorkoutSet set) {
        return new SetResponse(
                set.getId(),
                set.getSession().getId(),
                set.getExercise().getId(),
                set.getSetNumber(),
                set.getWeightKg(),
                set.getReps());
    }
}
