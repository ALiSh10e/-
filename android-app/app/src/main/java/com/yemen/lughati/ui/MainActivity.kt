package com.yemen.lughati.ui

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.yemen.lughati.audio.OfflineAudioPlayer
import com.yemen.lughati.data.local.AppDatabase
import com.yemen.lughati.data.local.ProgressEntity
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var database: AppDatabase
    private lateinit var audioPlayer: OfflineAudioPlayer

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // تهيئة قاعدة البيانات المحلية
        database = AppDatabase.getInstance(this)
        audioPlayer = OfflineAudioPlayer(this)

        // التحقق من وجود تقدم سابق
        lifecycleScope.launch {
            database.progressDao().getProgressFlow().collectLatest { progress ->
                if (progress == null) {
                    database.progressDao().insertOrUpdate(
                        ProgressEntity(
                            id = 1,
                            selectedGrade = 1,
                            totalScore = 0,
                            starsEarned = 0
                        )
                    )
                }
            }
        }

        // تشغيل واجهة النشاط الرئيسية
        // setContentView(R.layout.activity_main)
    }

    override fun onPause() {
        super.onPause()
        audioPlayer.stop()
    }

    override fun onDestroy() {
        super.onDestroy()
        audioPlayer.release()
    }
}
