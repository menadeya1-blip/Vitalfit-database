package com.vitalfit.vitalfitbackend.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank @Size(max = 100) String fullName,
        @NotBlank @Email @Size(max = 100) String email,
        @NotBlank @Size(min = 8, max = 72) String password,
        @NotNull @Past LocalDate birthDate,
        @AssertTrue(message = "Debes aceptar los términos y condiciones") boolean acceptedTerms,
        @AssertTrue(message = "Debes aceptar la política de privacidad") boolean acceptedPrivacy
) {}
