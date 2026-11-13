package com.vitalfit.vitalfitbackend.dto.request;

import jakarta.validation.constraints.NotNull;

// routineId es opcional: una sesión puede no estar ligada a una rutina.
public record CreateSessionRequest(
        @NotNull(message = "El usuario es obligatorio.")
        Long userId,
        Long routineId
) {
}
