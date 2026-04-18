package com.formus.server.models;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "answers")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
    @SuppressFBWarnings(value = { "EI_EXPOSE_REP" }, justification = "Required by JPA")
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @SuppressFBWarnings(value = { "EI_EXPOSE_REP" }, justification = "Required by JPA")
    private Question question;

    @Column(name = "text_answer", columnDefinition = "TEXT")
    private String textAnswer;

    @Column(name = "selected_choice_id")
    private Long selectedChoiceId;

    @Column(name = "is_correct", nullable = false)
    private boolean isCorrect;

    @Column(name = "score")
    private Float score;

    public Answer(Question question, String textAnswer, Long selectedChoiceId) {
        this.question = question;
        this.textAnswer = textAnswer;
        this.selectedChoiceId = selectedChoiceId;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public void setEvaluationResult(boolean isCorrect, Float score) {
        this.isCorrect = isCorrect;
        this.score = score;
    }
}
