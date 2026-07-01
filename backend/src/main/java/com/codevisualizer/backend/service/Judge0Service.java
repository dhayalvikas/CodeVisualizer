package com.codevisualizer.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;

@Service
public class Judge0Service {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${judge0.url}")
    private String judge0Url;

    public Judge0Service(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String executeCode(String sourceCode, int languageId, String stdin) {
        try {
            String encodedSource = Base64.getEncoder()
                    .encodeToString(sourceCode.getBytes("UTF-8"));
            String encodedStdin = (stdin != null && !stdin.isEmpty())
                    ? Base64.getEncoder().encodeToString(stdin.getBytes("UTF-8"))
                    : "";

            // Build JSON manually to avoid any serialization issues
            ObjectMapper mapper = new ObjectMapper();
            com.fasterxml.jackson.databind.node.ObjectNode body = mapper.createObjectNode();
            body.put("source_code", encodedSource);
            body.put("language_id", languageId);
            body.put("stdin", encodedStdin);

            String jsonBody = mapper.writeValueAsString(body);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(jsonBody, headers);

            String submitUrl = judge0Url + "/submissions?base64_encoded=true&wait=true";
            ResponseEntity<String> response = restTemplate.postForEntity(
                    submitUrl, request, String.class);

            return decodeResult(response.getBody());

        } catch (Exception e) {
            return "Error executing code: " + e.getMessage();
        }
    }

    private String decodeResult(String responseJson) throws Exception {
        JsonNode root = objectMapper.readTree(responseJson);
        StringBuilder result = new StringBuilder();

        if (root.has("stdout") && !root.get("stdout").isNull()) {
            result.append(decodeBase64(root.get("stdout").asText()));
        }
        if (root.has("stderr") && !root.get("stderr").isNull()) {
            result.append("\nERROR:\n")
                    .append(decodeBase64(root.get("stderr").asText()));
        }
        if (root.has("compile_output") && !root.get("compile_output").isNull()) {
            result.append("\nCOMPILE ERROR:\n")
                    .append(decodeBase64(root.get("compile_output").asText()));
        }
        if (result.length() == 0 && root.has("status")) {
            result.append("Status: ")
                    .append(root.get("status").get("description").asText());
        }

        return result.toString();
    }

    private String decodeBase64(String encoded) {
        String cleaned = encoded.replaceAll("\\s", "");
        return new String(Base64.getDecoder().decode(cleaned));
    }
}