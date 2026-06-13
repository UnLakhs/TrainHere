package com.apostolos.backend.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
        @Min(1)
        @Max(5)
        short rating,

        @Size(max = 160)
        String title,

        @Size(max = 4000)
        String comment
) {
}
