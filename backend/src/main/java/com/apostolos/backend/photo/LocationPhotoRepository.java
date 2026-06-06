package com.apostolos.backend.photo;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationPhotoRepository extends JpaRepository<LocationPhoto, UUID> {

    List<LocationPhoto> findByLocationId(UUID locationId);
}
