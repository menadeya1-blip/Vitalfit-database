package com.vitalfit.vitalfitbackend.dto.response;

import com.vitalfit.vitalfitbackend.domain.model.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// Respuesta pública: nunca incluye la contraseña ni datos que el cliente no necesita.
public record UserResponse(
        Long id,
        String fullName,
        String email,
        LocalDate birthDate,
        BigDecimal weightKg,
        Integer heightCm,
        String fitnessGoal,
        Boolean darkMode,
        boolean parentalConsentPending,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getBirthDate(),
                user.getWeightKg(),
                user.getHeightCm(),
                user.getFitnessGoal(),
                user.getDarkMode(),
                user.isPendingParentalConsent(),
                user.getCreatedAt()
        );
    }
}
