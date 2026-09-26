package com.vitalfit.vitalfitbackend.controller;

import com.vitalfit.vitalfitbackend.domain.model.User;
import com.vitalfit.vitalfitbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // Permite que el frontend se conecte sin problemas de CORS
public class AuthController {

    @Autowired
    private UserService userService;

    // Ruta de Registro: POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.registerUser(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Ruta de Login: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    // Ruta de Onboarding: PUT /api/auth/onboarding/{id}
    @PutMapping("/onboarding/{id}")
    public ResponseEntity<?> onboarding(@PathVariable Long id, @RequestBody User onboardingData) {
        try {
            User updatedUser = userService.updateOnboarding(
                    id,
                    onboardingData.getWeightKg(),
                    onboardingData.getHeightCm(),
                    onboardingData.getFitnessGoal()
            );
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
