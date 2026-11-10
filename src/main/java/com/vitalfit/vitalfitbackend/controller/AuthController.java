package com.vitalfit.vitalfitbackend.controller;

import com.vitalfit.vitalfitbackend.dto.request.LoginRequest;
import com.vitalfit.vitalfitbackend.dto.request.OnboardingRequest;
import com.vitalfit.vitalfitbackend.dto.request.RegisterRequest;
import com.vitalfit.vitalfitbackend.dto.response.UserResponse;
import com.vitalfit.vitalfitbackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse body = UserResponse.from(userService.register(request));
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(UserResponse.from(userService.login(request)));
    }

    // PUT /api/auth/onboarding/{id}
    @PutMapping("/onboarding/{id}")
    public ResponseEntity<UserResponse> onboarding(@PathVariable Long id,
                                                   @Valid @RequestBody OnboardingRequest request) {
        return ResponseEntity.ok(UserResponse.from(userService.updateOnboarding(id, request)));
    }

    // POST /api/auth/users/{id}/parental-consent  (lo llama el padre o tutor)
    @PostMapping("/users/{id}/parental-consent")
    public ResponseEntity<UserResponse> parentalConsent(@PathVariable Long id) {
        return ResponseEntity.ok(UserResponse.from(userService.confirmParentalConsent(id)));
    }

    // DELETE /api/auth/users/{id}  (eliminar la cuenta y sus datos; pide credenciales para confirmar)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id,
                                              @Valid @RequestBody LoginRequest confirmation) {
        userService.deleteAccount(id, confirmation);
        return ResponseEntity.noContent().build();
    }
}
