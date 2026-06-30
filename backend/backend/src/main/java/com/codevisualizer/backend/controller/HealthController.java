package com.codevisualizer.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HealthController {

    @GetMapping("/health")
    public String health() {
        return "Code Visualizer backend is running!";
    }
}
