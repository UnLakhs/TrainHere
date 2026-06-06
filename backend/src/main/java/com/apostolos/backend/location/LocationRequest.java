package com.apostolos.backend.location;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LocationRequest(
        @NotBlank
        @Size(max = 180)
        String name,

        @NotNull
        LocationType type,

        @Size(max = 2000)
        String description,

        @NotBlank
        @Size(max = 120)
        String country,

        @NotBlank
        @Size(max = 120)
        String city,

        @Size(max = 255)
        String address,

        @NotNull
        @DecimalMin("-90.0")
        @DecimalMax("90.0")
        BigDecimal latitude,

        @NotNull
        @DecimalMin("-180.0")
        @DecimalMax("180.0")
        BigDecimal longitude
) {
}
