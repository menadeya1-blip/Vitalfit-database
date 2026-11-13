package com.vitalfit.vitalfitbackend.service.impl;

import com.vitalfit.vitalfitbackend.domain.model.Exercise;
import com.vitalfit.vitalfitbackend.domain.model.Routine;
import com.vitalfit.vitalfitbackend.domain.model.User;
import com.vitalfit.vitalfitbackend.domain.model.WorkoutSession;
import com.vitalfit.vitalfitbackend.domain.model.WorkoutSet;
import com.vitalfit.vitalfitbackend.dto.request.CreateSessionRequest;
import com.vitalfit.vitalfitbackend.dto.request.SetRequest;
import com.vitalfit.vitalfitbackend.exception.ApiExceptions.ExerciseNotFoundException;
import com.vitalfit.vitalfitbackend.exception.ApiExceptions.SessionNotFoundException;
import com.vitalfit.vitalfitbackend.exception.ApiExceptions.UserNotFoundException;
import com.vitalfit.vitalfitbackend.repository.ExerciseRepository;
import com.vitalfit.vitalfitbackend.repository.RoutineRepository;
import com.vitalfit.vitalfitbackend.repository.UserRepository;
import com.vitalfit.vitalfitbackend.repository.WorkoutSessionRepository;
import com.vitalfit.vitalfitbackend.repository.WorkoutSetRepository;
import com.vitalfit.vitalfitbackend.service.TrainingService;
import org.springframework.stereotype.Service;

@Service
public class TrainingServiceImpl implements TrainingService {

    private final UserRepository userRepository;
    private final RoutineRepository routineRepository;
    private final WorkoutSessionRepository sessionRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutSetRepository setRepository;

    public TrainingServiceImpl(UserRepository userRepository,
                               RoutineRepository routineRepository,
                               WorkoutSessionRepository sessionRepository,
                               ExerciseRepository exerciseRepository,
                               WorkoutSetRepository setRepository) {
        this.userRepository = userRepository;
        this.routineRepository = routineRepository;
        this.sessionRepository = sessionRepository;
        this.exerciseRepository = exerciseRepository;
        this.setRepository = setRepository;
    }

    @Override
    public WorkoutSession createSession(CreateSessionRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(UserNotFoundException::new);

        Routine routine = null;
        if (request.routineId() != null) {
            routine = routineRepository.findById(request.routineId())
                    .orElseThrow(() -> new IllegalArgumentException("La rutina no existe."));
        }

        return sessionRepository.save(new WorkoutSession(user, routine));
    }

    @Override
    public WorkoutSet addSet(Long sessionId, Long exerciseId, SetRequest request) {
        WorkoutSession session = sessionRepository.findById(sessionId)
                .orElseThrow(SessionNotFoundException::new);

        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(ExerciseNotFoundException::new);

        // Si la sesión está ligada a una rutina, el ejercicio debe pertenecer a esa rutina
        Routine sessionRoutine = session.getRoutine();
        if (sessionRoutine != null && !sessionRoutine.getId().equals(exercise.getRoutine().getId())) {
            throw new IllegalArgumentException("El ejercicio no pertenece a la rutina de esta sesión.");
        }

        // La numeración de la serie sale de las series ya guardadas de ese ejercicio en esta sesión
        long guardadas = setRepository.countBySessionIdAndExerciseId(sessionId, exerciseId);
        int numero = (int) guardadas + 1;

        WorkoutSet set = new WorkoutSet(session, exercise, numero, request.weightKg(), request.reps());
        return setRepository.save(set);
    }
}
