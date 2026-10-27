package com.vitalfit.vitalfitbackend.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record OnboardingRequest(
        @NotNull @DecimalMin("20.00") @DecimalMax("400.00")
        @Digits(integer = 3, fraction = 2) BigDecimal weightKg,
        @NotNull @Min(50) @Max(250) Integer heightCm,
        @NotBlank String fitnessGoal
) {}
