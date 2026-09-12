package com.kisanmitra.backend.repository;

import com.kisanmitra.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByMobile(String mobile);

    boolean existsByMobile(String mobile);
}