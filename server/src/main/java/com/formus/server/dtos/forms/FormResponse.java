package com.formus.server.dtos.forms;

import com.formus.server.models.Form;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormResponse {
    private Long id;
    private String title;
    private Long createdBy;

    public FormResponse(Form form) {
        this.id = form.getId();
        this.title = form.getTitle();
        this.createdBy = form.getCreatedBy();
    }
}
