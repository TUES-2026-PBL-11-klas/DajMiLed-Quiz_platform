package com.formus.server.dtos.submissions;

import lombok.Builder;
import lombok.Data;
import java.util.List;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;

@Data
@Builder
public class SubmissionResponse {
    private Long submissionId;
    private Float totalScore;
    @SuppressFBWarnings("EI_EXPOSE_REP2")
    private List<AnswerResultResponse> results;

    public List<AnswerResultResponse> getResults() {
        return results == null ? null : List.copyOf(results);
    }

    public static class SubmissionResponseBuilder {
        public SubmissionResponseBuilder results(List<AnswerResultResponse> results) {
            this.results = results == null ? null : List.copyOf(results);
            return this;
        }
    }
}
