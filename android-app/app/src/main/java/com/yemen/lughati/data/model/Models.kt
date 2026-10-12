package com.yemen.lughati.data.model

import com.google.gson.annotations.SerializedName

data class GradeData(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("title") val title: String,
    @SerializedName("levelDescription") val levelDescription: String,
    @SerializedName("units") val units: List<UnitData>
)

data class UnitData(
    @SerializedName("id") val id: String,
    @SerializedName("gradeId") val gradeId: Int,
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String,
    @SerializedName("lessons") val lessons: List<LessonData>
)

data class LessonData(
    @SerializedName("id") val id: String,
    @SerializedName("unitId") val unitId: String,
    @SerializedName("gradeId") val gradeId: Int,
    @SerializedName("title") val title: String,
    @SerializedName("summary") val summary: String,
    @SerializedName("objective") val objective: String,
    @SerializedName("content") val content: LessonContent,
    @SerializedName("questions") val questions: List<QuestionData>
)

data class LessonContent(
    @SerializedName("storyOrConcept") val storyOrConcept: String,
    @SerializedName("keyPoints") val keyPoints: List<String>,
    @SerializedName("yemeniContext") val yemeniContext: String?,
    @SerializedName("vocabulary") val vocabulary: List<VocabularyItem>
)

data class VocabularyItem(
    @SerializedName("word") val word: String,
    @SerializedName("diacritics") val diacritics: String,
    @SerializedName("meaning") val meaning: String,
    @SerializedName("example") val example: String
)

data class QuestionData(
    @SerializedName("id") val id: String,
    @SerializedName("type") val type: String,
    @SerializedName("prompt") val prompt: String,
    @SerializedName("audioPromptText") val audioPromptText: String?,
    @SerializedName("options") val options: List<String>?,
    @SerializedName("correctAnswer") val correctAnswer: Any,
    @SerializedName("explanation") val explanation: String,
    @SerializedName("hint") val hint: String,
    @SerializedName("imageOrEmoji") val imageOrEmoji: String?
)
