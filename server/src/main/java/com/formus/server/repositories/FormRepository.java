package com.formus.server.repositories;

import com.formus.server.models.Form;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {
    Page<Form> findAll(Pageable pageable);

    Optional<Form> findById(Long id);

    Page<Form> findByCreatedBy(Long id, Pageable pageable);
}
