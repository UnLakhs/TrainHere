package com.apostolos.backend.location;

import jakarta.validation.constraints.NotNull;

public record LocationStatusRequest(
        @NotNull
        LocationStatus status
) {
}
