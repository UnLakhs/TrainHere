package com.apostolos.backend.location;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "calisthenics_park_details")
public class CalisthenicsParkDetails {

    @Id
    @Column(name = "location_id")
    private UUID locationId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "location_id")
    private Location location;

    private boolean hasPullUpBars;
    private boolean hasDipBars;
    private boolean hasParallelBars;
    private boolean hasMonkeyBars;
    private boolean hasRings;
    private boolean hasPushUpStations;
    private boolean hasClimbingStructures;
    private boolean hasLighting;
    private boolean hasWaterAccess;
    private boolean hasShade;

    @Enumerated(EnumType.STRING)
    @Column(length = 40)
    private GroundType groundType;

    private boolean accessible;

    @Column(length = 120)
    private String maintenanceStatus;

    protected CalisthenicsParkDetails() {
    }

    public CalisthenicsParkDetails(Location location) {
        this.location = location;
    }

    public UUID getLocationId() {
        return locationId;
    }

    public Location getLocation() {
        return location;
    }
}
