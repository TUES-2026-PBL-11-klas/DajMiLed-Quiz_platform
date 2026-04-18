package com.formus.server.models;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "correct_answers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CorrectAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @SuppressFBWarnings(value = { "EI_EXPOSE_REP" }, justification = "Required by JPA")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "choice_id", nullable = false)
    @SuppressFBWarnings(value = { "EI_EXPOSE_REP" }, justification = "Required by JPA")
    private Choice choice;

    public CorrectAnswer(Question question, Choice choice) {
        this.question = question;
        this.choice = choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }
}
