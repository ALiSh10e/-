package com.yemen.lughati.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "student_progress")
data class ProgressEntity(
    @PrimaryKey val id: Int = 1,
    val selectedGrade: Int = 1,
    val totalScore: Int = 0,
    val starsEarned: Int = 0,
    val completedLessonsJson: String = "[]",
    val badgesJson: String = "[\"المتعلم المبتدئ\"]",
    val correctCount: Int = 0,
    val wrongCount: Int = 0,
    val soundEnabled: Boolean = true,
    val speechRate: Float = 0.85f,
    val lastUpdatedTimestamp: Long = System.currentTimeMillis()
)
