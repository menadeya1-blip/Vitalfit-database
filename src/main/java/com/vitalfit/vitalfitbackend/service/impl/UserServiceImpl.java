package com.vitalfit.vitalfitbackend.service.impl;

import com.vitalfit.vitalfitbackend.domain.enums.ConsentType;
import com.vitalfit.vitalfitbackend.domain.enums.FitnessGoal;
import com.vitalfit.vitalfitbackend.domain.model.Consent;
import com.vitalfit.vitalfitbackend.domain.model.User;
import com.vitalfit.vitalfitbackend.dto.request.LoginRequest;
import com.vitalfit.vitalfitbackend.dto.request.OnboardingRequest;
import com.vitalfit.vitalfitbackend.dto.request.RegisterRequest;
import com.vitalfit.vitalfitbackend.exception.ApiExceptions.*;
import com.vitalfit.vitalfitbackend.repository.ConsentRepository;
import com.vitalfit.vitalfitbackend.repository.UserRepository;
import com.vitalfit.vitalfitbackend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.Locale;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    // Versión vigente de los textos legales. Subirla cuando cambien los documentos.
    static final String DOCUMENT_VERSION = "v1.0";

    private final UserRepository userRepository;
    private final ConsentRepository consentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           ConsentRepository consentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.consentRepository = consentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyRegisteredException();
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setBirthDate(request.birthDate());
        user.setDarkMode(false);
        user.setParentalConsentRequired(isMinor(request.birthDate()));
        user.setCreatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        // Se guarda evidencia de la aceptación de cada documento
        consentRepository.save(new Consent(saved, ConsentType.TERMS, DOCUMENT_VERSION, true));
        consentRepository.save(new Consent(saved, ConsentType.PRIVACY, DOCUMENT_VERSION, true));

        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public User login(LoginRequest request) {
        User user = authenticate(request.email(), request.password());

        if (user.isPendingParentalConsent()) {
            throw new ParentalConsentPendingException();
        }
        return user;
    }

    @Override
    public User updateOnboarding(Long userId, OnboardingRequest request) {
        User user = findUser(userId);

        // Valida que el objetivo sea uno de los valores permitidos
        FitnessGoal goal = FitnessGoal.valueOf(request.fitnessGoal().trim().toUpperCase(Locale.ROOT));

        user.setWeightKg(request.weightKg());
        user.setHeightCm(request.heightCm());
        user.setFitnessGoal(goal.name());

        return userRepository.save(user);
    }

    @Override
    public User confirmParentalConsent(Long userId) {
        User user = findUser(userId);

        if (!Boolean.TRUE.equals(user.getParentalConsentRequired())) {
            throw new ParentalConsentNotRequiredException();
        }

        user.setParentalConsentAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        consentRepository.save(new Consent(saved, ConsentType.PARENTAL, DOCUMENT_VERSION, true));
        return saved;
    }

    @Override
    public void deleteAccount(Long userId, LoginRequest confirmation) {
        User user = authenticate(confirmation.email(), confirmation.password());
        if (!user.getId().equals(userId)) {
            throw new InvalidCredentialsException();
        }
        userRepository.delete(user);
    }

    // --- Métodos auxiliares ---

    private User authenticate(String email, String rawPassword) {
        // Mismo mensaje para correo inexistente o contraseña incorrecta (evita enumerar cuentas)
        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException();
        }
        return user;
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private boolean isMinor(LocalDate birthDate) {
        return Period.between(birthDate, LocalDate.now()).getYears() < 18;
    }
}
