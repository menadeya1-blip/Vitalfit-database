package com.vitalfit.vitalfitbackend.dto.response;

import com.vitalfit.vitalfitbackend.domain.model.WorkoutSession;

import java.time.LocalDateTime;

public record SessionResponse(Long id, Long userId, Long routineId, LocalDateTime startedAt) {

    public static SessionResponse from(WorkoutSession session) {
        return new SessionResponse(
                session.getId(),
                session.getUser().getId(),
                session.getRoutine() != null ? session.getRoutine().getId() : null,
                session.getStartedAt());
    }
}
