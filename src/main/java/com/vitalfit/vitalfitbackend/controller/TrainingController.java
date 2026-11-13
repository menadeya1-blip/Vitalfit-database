package com.vitalfit.vitalfitbackend.controller;

import com.vitalfit.vitalfitbackend.domain.model.WorkoutSession;
import com.vitalfit.vitalfitbackend.domain.model.WorkoutSet;
import com.vitalfit.vitalfitbackend.dto.request.CreateSessionRequest;
import com.vitalfit.vitalfitbackend.dto.request.SetRequest;
import com.vitalfit.vitalfitbackend.dto.response.SessionResponse;
import com.vitalfit.vitalfitbackend.dto.response.SetResponse;
import com.vitalfit.vitalfitbackend.service.TrainingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/training")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    // POST /api/training/sessions
    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> createSession(@Valid @RequestBody CreateSessionRequest request) {
        WorkoutSession session = trainingService.createSession(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SessionResponse.from(session));
    }

    // POST /api/training/sessions/{sessionId}/exercises/{exerciseId}/sets
    @PostMapping("/sessions/{sessionId}/exercises/{exerciseId}/sets")
    public ResponseEntity<SetResponse> addSet(@PathVariable Long sessionId,
                                              @PathVariable Long exerciseId,
                                              @Valid @RequestBody SetRequest request) {
        WorkoutSet set = trainingService.addSet(sessionId, exerciseId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SetResponse.from(set));
    }
}
