package com.apostolos.backend.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record LoginRequest(
        @NotBlank
        @Email
        String email,

        @NotBlank
        String password

) {


}
