package com.vitalfit.vitalfitbackend.service;

import com.vitalfit.vitalfitbackend.domain.model.WorkoutSession;
import com.vitalfit.vitalfitbackend.domain.model.WorkoutSet;
import com.vitalfit.vitalfitbackend.dto.request.CreateSessionRequest;
import com.vitalfit.vitalfitbackend.dto.request.SetRequest;

public interface TrainingService {

    WorkoutSession createSession(CreateSessionRequest request);

    WorkoutSet addSet(Long sessionId, Long exerciseId, SetRequest request);
}
