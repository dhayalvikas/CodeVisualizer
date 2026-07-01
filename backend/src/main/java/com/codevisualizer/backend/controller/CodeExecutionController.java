package com.codevisualizer.backend.controller;

import com.codevisualizer.backend.service.Judge0Service;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/execute")
@CrossOrigin(origins = "http://localhost:3000")
public class CodeExecutionController {

    private final Judge0Service judge0Service;

    public CodeExecutionController(Judge0Service judge0Service) {
        this.judge0Service = judge0Service;
    }

    @PostMapping
    public String execute(@RequestBody CodeRequest request) {
        return judge0Service.executeCode(request.getSourceCode(), request.getLanguageId(), request.getStdin());
    }

    public static class CodeRequest {
        private String sourceCode;
        private int languageId;
        private String stdin;

        public String getSourceCode() { return sourceCode; }
        public void setSourceCode(String sourceCode) { this.sourceCode = sourceCode; }
        public int getLanguageId() { return languageId; }
        public void setLanguageId(int languageId) { this.languageId = languageId; }
        public String getStdin() { return stdin; }
        public void setStdin(String stdin) { this.stdin = stdin; }
    }
}
