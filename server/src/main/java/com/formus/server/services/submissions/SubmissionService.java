package com.formus.server.services.submissions;

import com.formus.server.dtos.submissions.SubmissionRequest;
import com.formus.server.dtos.submissions.SubmissionResponse;

public interface SubmissionService {
    SubmissionResponse submitForm(SubmissionRequest request, String token);
}
