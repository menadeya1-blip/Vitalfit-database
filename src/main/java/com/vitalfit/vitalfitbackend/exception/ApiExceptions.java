package com.vitalfit.vitalfitbackend.exception;

// Excepciones de negocio. El GlobalExceptionHandler las convierte en respuestas HTTP.
public final class ApiExceptions {

    private ApiExceptions() {}

    public static class EmailAlreadyRegisteredException extends RuntimeException {
        public EmailAlreadyRegisteredException() {
            super("El correo electrónico ya está registrado.");
        }
    }

    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException() {
            super("Correo o contraseña incorrectos.");
        }
    }

    public static class ParentalConsentPendingException extends RuntimeException {
        public ParentalConsentPendingException() {
            super("La cuenta requiere la autorización de un padre o tutor.");
        }
    }

    public static class UserNotFoundException extends RuntimeException {
        public UserNotFoundException() {
            super("Usuario no encontrado.");
        }
    }

    public static class ParentalConsentNotRequiredException extends RuntimeException {
        public ParentalConsentNotRequiredException() {
            super("Esta cuenta no requiere consentimiento parental.");
        }
    }
}
