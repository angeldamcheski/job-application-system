package com.example.jobapplicationservice.model.base;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tbl_users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "dtype", discriminatorType = DiscriminatorType.STRING)
//@Inheritance(strategy = InheritanceType.JOINED)
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    protected Long id;

    @Column(name="first_name")
    private String firstName;

    @Column(name="last_name")
    private String lastName;

    @Column(name="email_address")
    private String emailAddress;

    @Column(name="phone_number")
    private String phoneNumber;
}
