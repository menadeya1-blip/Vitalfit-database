package com.vitalfit.vitalfitbackend.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SetRequest(
        @NotNull(message = "El peso es obligatorio.")
        @DecimalMin(value = "0", inclusive = true, message = "El peso no puede ser negativo.")
        BigDecimal weightKg,

        @NotNull(message = "Las repeticiones son obligatorias.")
        @Min(value = 1, message = "Las repeticiones deben ser al menos 1.")
        Integer reps
) {
}
