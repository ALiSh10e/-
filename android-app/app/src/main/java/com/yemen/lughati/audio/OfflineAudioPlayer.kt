package com.yemen.lughati.audio

import android.content.Context
import android.media.AudioAttributes
import android.media.SoundPool
import android.os.Build
import android.speech.tts.TextToSpeech
import android.util.Log
import java.util.Locale

/**
 * مشغل الصوتيات المحلي المعتمد على عتاد الجهاز حصراً دون اتصال بالإنترنت
 * متوافق تماماً مع Android 7.0 (API 24) فما فوق
 */
class OfflineAudioPlayer(private val context: Context) : TextToSpeech.OnInitListener {

    private var soundPool: SoundPool? = null
    private var tts: TextToSpeech? = null
    private var isTtsInitialized = false
    private var isArabicAvailable = false
    private var isMuted = false

    private var soundCorrectId = 0
    private var soundHintId = 0
    private var soundClickId = 0
    private var soundCelebrationId = 0

    init {
        initSoundPool()
        initTextToSpeech()
    }

    private fun initSoundPool() {
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_GAME)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build()

        soundPool = SoundPool.Builder()
            .setMaxStreams(4)
            .setAudioAttributes(audioAttributes)
            .build()
    }

    private fun initTextToSpeech() {
        tts = TextToSpeech(context, this)
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val arabicLocale = Locale("ar")
            val result = tts?.setLanguage(arabicLocale)
            if (result == TextToSpeech.LANG_AVAILABLE || result == TextToSpeech.LANG_COUNTRY_AVAILABLE) {
                isArabicAvailable = true
                tts?.setSpeechRate(0.85f) // وتيرة هادئة تناسب الطفل
                tts?.setPitch(1.05f)
            } else {
                Log.w("OfflineAudioPlayer", "حزمة الصوت العربي غير مثبتة على محرك TTS المحلي للجهاز.")
                isArabicAvailable = false
            }
            isTtsInitialized = true
        } else {
            Log.e("OfflineAudioPlayer", "فشل تهيئة TextToSpeech.")
            isTtsInitialized = false
        }
    }

    fun setMuted(muted: boolean) {
        isMuted = muted
    }

    fun isMuted(): Boolean = isMuted

    fun hasArabicTTS(): Boolean = isArabicAvailable

    /**
     * نطق الكلمة أو الحرف العربي محلياً
     */
    fun speakArabic(text: String) {
        if (isMuted || !isTtsInitialized || !isArabicAvailable) return

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "yemen_arabic_${System.currentTimeMillis()}")
        } else {
            @Suppress("DEPRECATION")
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null)
        }
    }

    fun stop() {
        tts?.stop()
    }

    fun release() {
        tts?.stop()
        tts?.shutdown()
        soundPool?.release()
        soundPool = null
    }
}
