package com.apostolos.backend.photo;

import jakarta.validation.constraints.NotNull;

public record PhotoStatusRequest(
        @NotNull
        PhotoStatus status
) {
}
