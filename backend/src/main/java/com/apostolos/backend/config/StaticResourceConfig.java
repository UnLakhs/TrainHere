package com.apostolos.backend.config;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    private final Path photoStorageDirectory;

    public StaticResourceConfig(
            @Value("${trainhere.uploads.location-photos-dir:uploads/location-photos}") String photoStorageDirectory
    ) {
        this.photoStorageDirectory = Path.of(photoStorageDirectory).toAbsolutePath().normalize();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/location-photos/**")
                .addResourceLocations(photoStorageDirectory.toUri().toString());
    }
}
