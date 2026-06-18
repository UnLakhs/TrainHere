package com.apostolos.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import com.apostolos.backend.favorite.FavoriteRepository;
import com.apostolos.backend.location.LocationRepository;
import com.apostolos.backend.photo.LocationPhotoService;
import com.apostolos.backend.review.ReviewRepository;
import com.apostolos.backend.user.AppUserRepository;

@SpringBootTest(properties = {
        "spring.autoconfigure.exclude="
                + "org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration,"
                + "org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration,"
                + "org.springframework.boot.data.jpa.autoconfigure.DataJpaRepositoriesAutoConfiguration,"
                + "org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration"
})
class BackendApplicationTests {

    @MockitoBean
    private LocationRepository locationRepository;

    @MockitoBean
    private AppUserRepository appUserRepository;

    @MockitoBean
    private FavoriteRepository favoriteRepository;

    @MockitoBean
    private ReviewRepository reviewRepository;

    @MockitoBean
    private LocationPhotoService locationPhotoService;

    @MockitoBean
    private PasswordEncoder passwordEncoder;

    @Test
    void contextLoads() {
    }

}
