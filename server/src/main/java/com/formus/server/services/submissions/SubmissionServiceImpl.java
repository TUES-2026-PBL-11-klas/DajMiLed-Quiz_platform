package com.formus.server.services.submissions;

import com.formus.server.dtos.submissions.AnswerRequest;
import com.formus.server.dtos.submissions.AnswerResultResponse;
import com.formus.server.dtos.submissions.SubmissionRequest;
import com.formus.server.dtos.submissions.SubmissionResponse;
import com.formus.server.exceptions.ResourceNotFoundException;
import com.formus.server.jwt.JwtProvider;
import com.formus.server.models.Answer;
import com.formus.server.models.CorrectAnswer;
import com.formus.server.models.Form;
import com.formus.server.models.Question;
import com.formus.server.models.QuestionType;
import com.formus.server.models.Submission;
import com.formus.server.models.User;
import com.formus.server.repositories.CorrectAnswerRepository;
import com.formus.server.repositories.FormRepository;
import com.formus.server.repositories.SubmissionRepository;
import com.formus.server.repositories.UserRepository;
import com.formus.server.client.evaluation.EvaluationService;
import com.formus.server.client.evaluation.dto.EvaluationRequestDTO;
import com.formus.server.client.evaluation.dto.EvaluationResponseDTO;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

        private static final Logger logger = LoggerFactory.getLogger(SubmissionServiceImpl.class);

        private final FormRepository formRepository;
        private final UserRepository userRepository;
        private final SubmissionRepository submissionRepository;
        private final EvaluationService evaluationService;
        private final CorrectAnswerRepository correctAnswerRepository;
        private final JwtProvider jwtProvider;

        @Override
        @Transactional
        public SubmissionResponse submitForm(SubmissionRequest request, String token) {
                Long userId = jwtProvider.getIdFromToken(token);
                logger.info("Starting form submission for formId: {}, userId: {}", request.getFormId(), userId);

                Form form = formRepository.findById(request.getFormId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Form not found with id: " + request.getFormId()));

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "User not found with id: " + userId));

                if (request.getAnswers().size() != form.getQuestions().size()) {
                        throw new IllegalArgumentException(
                                        "Partial submissions are not allowed. All questions must be answered.");
                }

                Map<Long, Question> questionMap = form.getQuestions().stream()
                                .collect(Collectors.toMap(Question::getId, Function.identity()));

                List<Long> questionIds = request.getAnswers().stream()
                                .map(AnswerRequest::getQuestionId).collect(Collectors.toList());

                Map<Long, CorrectAnswer> correctAnswerMap = correctAnswerRepository.findByQuestionIdIn(questionIds)
                                .stream()
                                .collect(Collectors.toMap(ca -> ca.getQuestion().getId(), Function.identity()));

                Submission submission = new Submission(form, user);

                float totalScore = 0f;
                List<AnswerResultResponse> resultResponses = new ArrayList<>();

                for (AnswerRequest answerRequest : request.getAnswers()) {

                        Question question = questionMap.get(answerRequest.getQuestionId());
                        if (question == null) {
                                throw new IllegalArgumentException(
                                                "Invalid question ID: " + answerRequest.getQuestionId()
                                                                + " for form: " + form.getId());
                        }

                        QuestionType type = question.getType();
                        boolean isOpenEndedType = type == QuestionType.OPEN || type == QuestionType.OPEN_ENDED;

                        EvaluationResponseDTO evalRes;

                        if (!isOpenEndedType) {
                                CorrectAnswer correctAnswer = correctAnswerMap.get(question.getId());
                                if (correctAnswer == null) {
                                        throw new ResourceNotFoundException(
                                                        "Correct answer not found for question: "
                                                                        + question.getId());
                                }

                                Long correctChoiceId = correctAnswer.getChoice().getId();
                                Long selectedChoiceId = answerRequest.getSelectedChoiceId();

                                if (selectedChoiceId == null) {
                                        throw new IllegalArgumentException(
                                                        "Selected choice must be provided for closed question: "
                                                                        + question.getId());
                                }

                                boolean isCorrect = selectedChoiceId.equals(correctChoiceId);

                                evalRes = new EvaluationResponseDTO(
                                                isCorrect ? 1.0f : 0.0f,
                                                isCorrect
                                                                ? "Correct! You selected the right answer."
                                                                : "Incorrect. The correct answer was: "
                                                                                + correctAnswer.getChoice()
                                                                                                .getText(),
                                                isCorrect);

                        } else {
                                String userAnswerText = answerRequest.getAnswerText();

                                if (userAnswerText == null || userAnswerText.isBlank()) {
                                        throw new IllegalArgumentException(
                                                        "Answer text must be provided for open question: "
                                                                        + question.getId());
                                }

                                String evaluationQuestionType = "open";
                                if (type == QuestionType.CLOSED) {
                                        evaluationQuestionType = "closed";
                                }

                                EvaluationRequestDTO evalReq = EvaluationRequestDTO.builder()
                                                .context(form.getContext() != null ? form.getContext() : "")
                                                .question(question.getText())
                                                .answer(userAnswerText)
                                                .questionType(evaluationQuestionType)
                                                .build();

                                evalRes = evaluationService.evaluateAnswer(evalReq);
                        }

                        totalScore += evalRes.getScore() != null ? evalRes.getScore() : 0f;

                        Answer answerEntity = new Answer(
                                        question,
                                        answerRequest.getAnswerText(),
                                        answerRequest.getSelectedChoiceId());

                        answerEntity.setEvaluationResult(
                                        evalRes.isCorrect(),
                                        evalRes.getScore());

                        submission.addAnswer(answerEntity);

                        resultResponses.add(AnswerResultResponse.builder()
                                        .questionId(question.getId())
                                        .isCorrect(evalRes.isCorrect())
                                        .score(evalRes.getScore())
                                        .build());
                }

                submissionRepository.save(submission);

                logger.info("Successfully persisted submission ID: {}", submission.getId());

                float averageScore = request.getAnswers().size() > 0 ? totalScore / request.getAnswers().size() : 0f;

                return SubmissionResponse.builder()
                                .submissionId(submission.getId())
                                .totalScore(averageScore)
                                .results(resultResponses)
                                .build();
        }
}
