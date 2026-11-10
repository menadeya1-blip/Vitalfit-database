package com.vitalfit.vitalfitbackend.service;

import com.vitalfit.vitalfitbackend.domain.model.User;
import com.vitalfit.vitalfitbackend.dto.request.LoginRequest;
import com.vitalfit.vitalfitbackend.dto.request.OnboardingRequest;
import com.vitalfit.vitalfitbackend.dto.request.RegisterRequest;

// Puerto de entrada de la lógica de usuarios. El controlador depende de esta interfaz.
public interface UserService {

    User register(RegisterRequest request);

    User login(LoginRequest request);

    User updateOnboarding(Long userId, OnboardingRequest request);

    // Un padre o tutor confirma el consentimiento de una cuenta de menor.
    User confirmParentalConsent(Long userId);

    // Elimina la cuenta y, por CASCADE en la BD, sus datos relacionados.
    void deleteAccount(Long userId, LoginRequest confirmation);
}
