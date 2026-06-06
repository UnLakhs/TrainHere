package com.apostolos.backend.location;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "gym_details")
public class GymDetails {

    @Id
    @Column(name = "location_id")
    private UUID locationId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "location_id")
    private Location location;

    private boolean dayPassAvailable;

    @Column(precision = 8, scale = 2)
    private BigDecimal dayPassCost;

    @Column(precision = 8, scale = 2)
    private BigDecimal monthlyMembershipCost;

    private boolean hasFreeWeights;
    private boolean hasMachines;
    private boolean hasCardioEquipment;
    private boolean hasFunctionalTrainingArea;
    private boolean hasCalisthenicsArea;
    private boolean hasLockerRooms;
    private boolean hasShowers;
    @Column(name = "open_24_hours")
    private boolean open24Hours;

    @Column(columnDefinition = "text")
    private String openingHours;

    @Column(columnDefinition = "text")
    private String peakHours;

    private boolean parkingAvailable;
    private boolean personalTrainingAvailable;

    protected GymDetails() {
    }

    public GymDetails(Location location) {
        this.location = location;
    }

    public UUID getLocationId() {
        return locationId;
    }

    public Location getLocation() {
        return location;
    }
}
