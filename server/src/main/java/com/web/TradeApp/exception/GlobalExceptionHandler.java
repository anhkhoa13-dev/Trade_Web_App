package com.web.TradeApp.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.net.URI;
import java.time.Instant;
import java.util.NoSuchElementException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@ControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler({
            NoResourceFoundException.class,
            NoSuchElementException.class,
            UsernameNotFoundException.class,
            UserNotFoundException.class
    })
    public ProblemDetail handleNotFoundException(Exception ex) {
        logger.warn("Resource not found: {}", ex.getMessage());

        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
        problem.setTitle("Resource Not Found");
        problem.setDetail(ex.getMessage());
        problem.setType(URI.create("https://api.example.com/errors/not-found"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ProblemDetail handleBadCredentials(BadCredentialsException ex) {
        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
        problem.setTitle("Authentication failed");
        problem.setDetail("Invalid username or password");
        problem.setType(URI.create("https://api.example.com/errors/authentication-failed"));
        return problem;
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ProblemDetail handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        logger.warn("Data integrity violation", ex);

        String originalMessage = ex.getMostSpecificCause() != null
                ? ex.getMostSpecificCause().getMessage()
                : ex.getMessage();

        String safeMessage = "A data integrity violation occurred.";

        if (originalMessage != null) {
            if (originalMessage.contains("Duplicate entry")) {
                // Example message: "Duplicate entry 'user@example.com' for key
                // 'users.UK6dotkott2kjsp8vw4d0m25fb7'"
                String duplicatedValue = extractBetween(originalMessage, "Duplicate entry '", "'");
                safeMessage = duplicatedValue != null
                        ? String.format("The value '%s' is already in use. Please choose a different one.",
                                duplicatedValue)
                        : "A duplicate value exists. Please use a unique value.";
            } else if (originalMessage.toLowerCase().contains("constraint")) {
                safeMessage = "Your request violates a database rule. Please check your input.";
            }
        }

        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.CONFLICT);
        problem.setTitle("Conflict");
        problem.setDetail(safeMessage);
        problem.setType(URI.create("https://api.example.com/errors/data-integrity"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGenericException(Exception ex) {
        logger.error("Unexpected error occurred", ex);

        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problem.setTitle("Internal Server Error");
        problem.setDetail("An unexpected error occurred.");
        problem.setType(URI.create("https://api.example.com/errors/internal"));
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    private String extractBetween(String text, String start, String end) {
        int startIndex = text.indexOf(start);
        if (startIndex == -1)
            return null;
        int endIndex = text.indexOf(end, startIndex + start.length());
        if (endIndex == -1)
            return null;
        return text.substring(startIndex + start.length(), endIndex);
    }
}
