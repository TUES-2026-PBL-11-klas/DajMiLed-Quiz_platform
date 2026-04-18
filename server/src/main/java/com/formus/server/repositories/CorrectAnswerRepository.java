package com.formus.server.repositories;

import com.formus.server.models.CorrectAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CorrectAnswerRepository extends JpaRepository<CorrectAnswer, Long> {
    Optional<CorrectAnswer> findByQuestionId(Long questionId);
}
