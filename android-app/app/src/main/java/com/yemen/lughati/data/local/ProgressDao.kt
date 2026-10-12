package com.yemen.lughati.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface ProgressDao {
    @Query("SELECT * FROM student_progress WHERE id = 1 LIMIT 1")
    fun getProgressFlow(): Flow<ProgressEntity?>

    @Query("SELECT * FROM student_progress WHERE id = 1 LIMIT 1")
    suspend fun getProgress(): ProgressEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(progress: ProgressEntity)

    @Query("UPDATE student_progress SET selectedGrade = :grade WHERE id = 1")
    suspend fun updateSelectedGrade(grade: Int)

    @Query("DELETE FROM student_progress")
    suspend fun clearAllProgress()
}
