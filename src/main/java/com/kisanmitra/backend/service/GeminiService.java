package com.kisanmitra.backend.service;

import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build();


    // =========================================================
    // TEXT CHAT
    // =========================================================

    public String getResponse(String message) {
        return getResponse(
                message,
                "Uttar Pradesh",
                "Black Soil",
                "Kharif"
        );
    }


    public String getResponse(
            String message,
            String state,
            String soil,
            String season) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/interactions";

        String prompt = String.format(

                "You are KisanMitra (किसान मित्र), a friendly and practical AI "
                        + "agricultural assistant for Indian farmers. "

                        + "IMPORTANT RULES: "

                        + "1. Always respond in simple Hinglish (Hindi + English mix). "

                        + "2. Give practical, easy-to-understand advice suitable for farmers. "

                        + "3. Use the farmer's State, Soil and Season context when relevant. "

                        + "4. Never claim that one crop, fertilizer, pesticide or treatment is "
                        + "definitely the best unless sufficient information is available. "

                        + "5. If important information is missing, clearly mention what additional "
                        + "information is needed. "

                        + "6. Do not make guaranteed claims about profit, yield or crop success. "

                        + "7. For crop recommendations, consider soil, season, water availability "
                        + "and local conditions whenever possible. "

                        + "8. For disease or pest questions, do not give a definite diagnosis "
                        + "from limited information. Suggest verification when necessary. "

                        + "9. For pesticides, fertilizers or chemicals, avoid unsafe or unsupported "
                        + "dosages. Recommend following the product label or local agricultural "
                        + "expert guidance when exact dosage is required. "

                        + "10. Keep answers concise but useful. Use bullet points or numbered "
                        + "steps when helpful. "

                        + "11. Use emojis sparingly for readability. "

                        + "12. If the question is unrelated to agriculture, politely answer briefly "
                        + "or explain that you are primarily an agricultural assistant. "

                        + "FARMER CONTEXT: "
                        + "State: %s, "
                        + "Soil: %s, "
                        + "Season: %s. "

                        + "FARMER'S QUESTION: %s",

                state,
                soil,
                season,
                message
        );


        JSONObject requestJson = new JSONObject();

        requestJson.put(
                "model",
                "gemini-3.6-flash"
        );

        requestJson.put(
                "input",
                prompt
        );


        RequestBody body = RequestBody.create(
                requestJson.toString(),
                MediaType.parse("application/json")
        );


        Request request = new Request.Builder()
                .url(url)
                .addHeader(
                        "x-goog-api-key",
                        apiKey
                )
                .addHeader(
                        "Content-Type",
                        "application/json"
                )
                .post(body)
                .build();


        try (Response response =
                     client.newCall(request).execute()) {

            String responseBody =
                    response.body().string();

            System.out.println(
                    "Gemini Response: "
                            + responseBody
            );


            if (!response.isSuccessful()) {

                return "Gemini API error: "
                        + response.code()
                        + " - "
                        + responseBody;
            }


            JSONObject json =
                    new JSONObject(responseBody);

            JSONArray steps =
                    json.getJSONArray("steps");


            for (int i = 0;
                 i < steps.length();
                 i++) {

                JSONObject step =
                        steps.getJSONObject(i);


                if ("model_output".equals(
                        step.getString("type"))) {

                    JSONArray content =
                            step.getJSONArray("content");


                    return content
                            .getJSONObject(0)
                            .getString("text");
                }
            }


            return "Sorry, Gemini ne koi response nahi diya.";


        } catch (IOException e) {

            return "Unable to connect to Gemini: "
                    + e.getMessage();

        } catch (Exception e) {

            return "Gemini response parsing error: "
                    + e.getMessage();
        }
    }


    // =========================================================
    // IMAGE / PLANT DISEASE ANALYSIS
    // =========================================================

    public String analyzePlantImage(
            byte[] imageBytes,
            String mimeType,
            String state,
            String soil,
            String season) {

        String url =
                "https://generativelanguage.googleapis.com/v1beta/interactions";


        String imageBase64 =
                Base64.getEncoder()
                        .encodeToString(imageBytes);


        String prompt = String.format(

                "You are KisanMitra (किसान मित्र), an AI agricultural "
                        + "assistant helping Indian farmers identify possible "
                        + "plant diseases or health problems from crop images. "

                        + "Analyze the attached plant/leaf image carefully. "

                        + "IMPORTANT RULES: "

                        + "1. Respond in simple Hinglish. "

                        + "2. Identify the crop if it can be recognized. "

                        + "3. Identify the most likely disease, pest, nutrient "
                        + "deficiency, or other visible problem if possible. "

                        + "4. Never claim a diagnosis is 100%% certain from an image alone. "

                        + "5. If the image is unclear, say that clearly. "

                        + "6. Give a short explanation of the visible symptoms. "

                        + "7. Give practical next steps for the farmer. "

                        + "8. Do not provide unsafe or unsupported pesticide dosages. "

                        + "9. If chemical treatment may be required, advise following "
                        + "the product label or consulting a local agriculture expert. "

                        + "10. Mention when the farmer should seek verification from "
                        + "a Krishi Vigyan Kendra (KVK) or agriculture officer. "

                        + "11. Keep the answer concise and easy to understand. "

                        + "FARMER CONTEXT: "
                        + "State: %s, "
                        + "Soil: %s, "
                        + "Season: %s.",

                state,
                soil,
                season
        );


        JSONObject requestJson =
                new JSONObject();

        requestJson.put(
                "model",
                "gemini-3.6-flash"
        );

        requestJson.put(
                "input",
                new JSONArray()
                        .put(
                                new JSONObject()
                                        .put(
                                                "type",
                                                "text"
                                        )
                                        .put(
                                                "text",
                                                prompt
                                        )
                        )
                        .put(
                                new JSONObject()
                                        .put(
                                                "type",
                                                "image"
                                        )
                                        .put(
                                                "data",
                                                imageBase64
                                        )
                                        .put(
                                                "mime_type",
                                                mimeType
                                        )
                        )
        );


        RequestBody body =
                RequestBody.create(
                        requestJson.toString(),
                        MediaType.parse(
                                "application/json"
                        )
                );


        Request request =
                new Request.Builder()
                        .url(url)
                        .addHeader(
                                "x-goog-api-key",
                                apiKey
                        )
                        .addHeader(
                                "Content-Type",
                                "application/json"
                        )
                        .post(body)
                        .build();


        try (Response response =
                     client.newCall(request).execute()) {

            String responseBody =
                    response.body().string();

            System.out.println(
                    "Gemini Image Response: "
                            + responseBody
            );


            if (!response.isSuccessful()) {

                return "Gemini image analysis error: "
                        + response.code()
                        + " - "
                        + responseBody;
            }


            JSONObject json =
                    new JSONObject(responseBody);

            JSONArray steps =
                    json.getJSONArray("steps");


            for (int i = 0;
                 i < steps.length();
                 i++) {

                JSONObject step =
                        steps.getJSONObject(i);


                if ("model_output".equals(
                        step.getString("type"))) {

                    JSONArray content =
                            step.getJSONArray("content");


                    return content
                            .getJSONObject(0)
                            .getString("text");
                }
            }


            return "Sorry, Gemini image analysis ka response nahi mila.";


        } catch (IOException e) {

            return "Unable to connect to Gemini: "
                    + e.getMessage();

        } catch (Exception e) {

            return "Gemini image response parsing error: "
                    + e.getMessage();
        }
    }
}