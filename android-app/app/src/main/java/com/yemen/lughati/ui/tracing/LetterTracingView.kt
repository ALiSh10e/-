package com.yemen.lughati.ui.tracing

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View

/**
 * لوحة تفاعلية مخصصة لكتابة وتتبع الحروف العربية بأصابع الطفل
 * متوافقة مع Android 7.0 ومحسوبة للعمل بسلاسة على شاشات اللمس الاقتصادية
 */
class LetterTracingView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    private var drawPath = Path()
    private var drawPaint = Paint()
    private var canvasPaint = Paint(Paint.DITHER_FLAG)
    private var drawCanvas: Canvas? = null
    private var canvasBitmap: Bitmap? = null

    private var currentLetter: String = "ب"
    private var letterPaint = Paint()

    init {
        setupDrawing()
    }

    private fun setupDrawing() {
        drawPaint.apply {
            color = Color.parseColor("#0284C7") // Sky blue child pencil
            isAntiAlias = true
            strokeWidth = 28f
            style = Paint.Style.STROKE
            strokeJoin = Paint.Join.ROUND
            strokeCap = Paint.Cap.ROUND
        }

        letterPaint.apply {
            color = Color.parseColor("#E2E8F0") // Faint guide letter in background
            isAntiAlias = true
            textSize = 280f
            textAlign = Paint.Align.CENTER
            style = Paint.Style.FILL
            isFakeBoldText = true
        }
    }

    fun setLetter(letter: String) {
        currentLetter = letter
        clearCanvas()
    }

    fun setBrushColor(colorHex: String) {
        drawPaint.color = Color.parseColor(colorHex)
    }

    fun clearCanvas() {
        drawPath.reset()
        canvasBitmap?.eraseColor(Color.TRANSPARENT)
        invalidate()
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        if (w > 0 && h > 0) {
            canvasBitmap = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888)
            drawCanvas = Canvas(canvasBitmap!!)
        }
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        // رسم الحرف الاسترشادي الشفاف في الخلفية للطفل ليتتبعه
        val xPos = width / 2f
        val yPos = (height / 2f) - ((letterPaint.descent() + letterPaint.ascent()) / 2f)
        canvas.drawText(currentLetter, xPos, yPos, letterPaint)

        // رسم خطوط الطفل فوق الحرف
        canvasBitmap?.let {
            canvas.drawBitmap(it, 0f, 0f, canvasPaint)
        }
        canvas.drawPath(drawPath, drawPaint)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        val touchX = event.x
        val touchY = event.y

        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                drawPath.moveTo(touchX, touchY)
            }
            MotionEvent.ACTION_MOVE -> {
                drawPath.lineTo(touchX, touchY)
            }
            MotionEvent.ACTION_UP -> {
                drawCanvas?.drawPath(drawPath, drawPaint)
                drawPath.reset()
            }
            else -> return false
        }

        invalidate()
        return true
    }
}
