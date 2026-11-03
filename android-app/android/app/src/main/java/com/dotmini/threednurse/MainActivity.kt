package com.dotmini.threednurse

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.TypedValue
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import org.json.JSONObject

class MainActivity : AppCompatActivity() {

    companion object {
        private const val PRODUCTION_URL = "https://3dnurse.vercel.app"
        private const val EXIT_CONFIRM_WINDOW_MS = 2000L

        private val INJECTED_BRIDGE_JS = """
            (function() {
              if (window.__threeDNurseBridgeReady) return;
              window.__threeDNurseBridgeReady = true;
              window.isReactNative = true;
              window.isNativeAndroid = true;
              window.sendNativeHaptic = function(type) {
                try {
                  if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: type || 'HAPTIC_LIGHT' }));
                  }
                } catch (e) {}
              };
              document.addEventListener('click', function(e) {
                if (e.target && e.target.closest && (e.target.closest('button') || e.target.closest('.cursor-pointer'))) {
                  window.sendNativeHaptic('HAPTIC_LIGHT');
                }
              }, { passive: true });
            })();
        """.trimIndent()

        private val SMART_BACK_JS = """
            (function() {
              try {
                var store = window.useStore || window.__store || window.__useStore;
                if (store && typeof store.getState === 'function') {
                  var s = store.getState();
                  if (s.activeLightboxImage && typeof s.closeLightbox === 'function') {
                    s.closeLightbox();
                    return 'HANDLED';
                  }
                  if (s.currentRoom && s.currentRoom !== 'lobby' && typeof s.setRoom === 'function') {
                    s.setRoom('lobby');
                    return 'HANDLED';
                  }
                }
              } catch (e) {}
              return 'UNHANDLED';
            })();
        """.trimIndent()
    }

    private lateinit var rootContainer: FrameLayout
    private lateinit var webView: WebView
    private lateinit var fullscreenVideoContainer: FrameLayout
    private lateinit var loadingOverlay: LinearLayout
    private lateinit var errorOverlay: LinearLayout
    private lateinit var errorDetailText: TextView

    private var customVideoView: View? = null
    private var customVideoCallback: WebChromeClient.CustomViewCallback? = null
    private var hasMainFrameError: Boolean = false
    private var lastBackPressMs: Long = 0L

    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme)
        super.onCreate(savedInstanceState)

        configureSystemBars()
        setupViews()
        configureWebView()
        setupSmartBackNavigation()

        if (savedInstanceState == null) {
            webView.loadUrl(PRODUCTION_URL)
        } else {
            webView.restoreState(savedInstanceState)
        }
    }

    private fun configureSystemBars() {
        val bgSlate = Color.parseColor("#0F172A")
        @Suppress("DEPRECATION")
        window.statusBarColor = bgSlate
        @Suppress("DEPRECATION")
        window.navigationBarColor = bgSlate

        val insetsController = WindowCompat.getInsetsController(window, window.decorView)
        insetsController.isAppearanceLightStatusBars = false
        insetsController.isAppearanceLightNavigationBars = false
    }

    private fun setupViews() {
        val bgSlate = Color.parseColor("#0F172A")

        rootContainer = FrameLayout(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(bgSlate)
        }

        // Respect system bars, camera cutouts, and software keyboard on Android 7 - 16
        ViewCompat.setOnApplyWindowInsetsListener(rootContainer) { view, windowInsets ->
            val insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() or
                    WindowInsetsCompat.Type.displayCutout() or
                    WindowInsetsCompat.Type.ime()
            )
            view.setPadding(insets.left, insets.top, insets.right, insets.bottom)
            WindowInsetsCompat.CONSUMED
        }

        webView = WebView(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(bgSlate)
            overScrollMode = View.OVER_SCROLL_NEVER
            setLayerType(View.LAYER_TYPE_HARDWARE, null)
        }

        fullscreenVideoContainer = FrameLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.BLACK)
            visibility = View.GONE
        }

        loadingOverlay = buildLoadingOverlay()
        errorOverlay = buildErrorOverlay()

        rootContainer.addView(webView)
        rootContainer.addView(fullscreenVideoContainer)
        rootContainer.addView(loadingOverlay)
        rootContainer.addView(errorOverlay)

        setContentView(rootContainer)
    }

    private fun buildLoadingOverlay(): LinearLayout {
        return LinearLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#0F172A"))
            setPadding(dp(28), dp(28), dp(28), dp(28))
            isClickable = true
            isFocusable = true

            val logoView = ImageView(this@MainActivity).apply {
                layoutParams = LinearLayout.LayoutParams(dp(96), dp(96)).apply {
                    bottomMargin = dp(16)
                }
                setImageResource(R.drawable.splashscreen_logo)
                scaleType = ImageView.ScaleType.FIT_CENTER
            }

            val titleView = TextView(this@MainActivity).apply {
                text = "3DNURSE"
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 26f)
                setTypeface(typeface, Typeface.BOLD)
                setTextColor(Color.parseColor("#FDF2F8"))
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    bottomMargin = dp(8)
                }
            }

            val subtitleView = TextView(this@MainActivity).apply {
                text = "สื่อการเรียนรู้เสมือนจริงสามมิติ\nการดูแลมารดาหลังคลอดและทารกแรกเกิด"
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
                setTextColor(Color.parseColor("#CBD5E1"))
                gravity = Gravity.CENTER
                setLineSpacing(dp(3).toFloat(), 1.0f)
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    bottomMargin = dp(24)
                }
            }

            val spinner = ProgressBar(this@MainActivity).apply {
                indeterminateTintList = ColorStateList.valueOf(Color.parseColor("#F43F5E"))
                layoutParams = LinearLayout.LayoutParams(dp(44), dp(44)).apply {
                    bottomMargin = dp(14)
                }
            }

            val statusView = TextView(this@MainActivity).apply {
                text = "กำลังเข้าสู่หอผู้ป่วยจำลอง 3 มิติ..."
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 13f)
                setTypeface(typeface, Typeface.BOLD)
                setTextColor(Color.parseColor("#FB7185"))
                gravity = Gravity.CENTER
            }

            addView(logoView)
            addView(titleView)
            addView(subtitleView)
            addView(spinner)
            addView(statusView)
        }
    }

    private fun buildErrorOverlay(): LinearLayout {
        errorDetailText = TextView(this).apply {
            text = "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต (Wi-Fi หรือมือถือ)\nแล้วกดปุ่มด้านล่างเพื่อเข้าสู่ระบบอีกครั้ง"
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            setTextColor(Color.parseColor("#94A3B8"))
            gravity = Gravity.CENTER
            setLineSpacing(dp(3).toFloat(), 1.0f)
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = dp(24)
            }
        }

        val retryButtonBg = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = dp(28).toFloat()
            setColor(Color.parseColor("#E11D48"))
        }

        val retryButton = Button(this).apply {
            text = "เชื่อมต่อใหม่อีกครั้ง"
            isAllCaps = false
            setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            setTypeface(typeface, Typeface.BOLD)
            setTextColor(Color.WHITE)
            background = retryButtonBg
            setPadding(dp(28), dp(12), dp(28), dp(12))
            setOnClickListener {
                triggerHaptic("HAPTIC_MEDIUM")
                hasMainFrameError = false
                errorOverlay.visibility = View.GONE
                loadingOverlay.alpha = 1f
                loadingOverlay.visibility = View.VISIBLE
                webView.loadUrl(PRODUCTION_URL)
            }
        }

        return LinearLayout(this).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.parseColor("#0F172A"))
            setPadding(dp(32), dp(32), dp(32), dp(32))
            visibility = View.GONE
            isClickable = true
            isFocusable = true

            val logoView = ImageView(this@MainActivity).apply {
                layoutParams = LinearLayout.LayoutParams(dp(76), dp(76)).apply {
                    bottomMargin = dp(16)
                }
                setImageResource(R.drawable.splashscreen_logo)
                scaleType = ImageView.ScaleType.FIT_CENTER
            }

            val errorTitle = TextView(this@MainActivity).apply {
                text = "ไม่สามารถเชื่อมต่อ 3DNURSE ได้"
                setTextSize(TypedValue.COMPLEX_UNIT_SP, 19f)
                setTypeface(typeface, Typeface.BOLD)
                setTextColor(Color.parseColor("#FDA4AF"))
                gravity = Gravity.CENTER
                layoutParams = LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply {
                    bottomMargin = dp(10)
                }
            }

            addView(logoView)
            addView(errorTitle)
            addView(errorDetailText)
            addView(retryButton)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            loadWithOverviewMode = true
            useWideViewPort = true
            builtInZoomControls = false
            displayZoomControls = false
            setSupportZoom(false)
            allowFileAccess = false
            allowContentAccess = false
            setSupportMultipleWindows(false)
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            userAgentString = "$userAgentString 3DNURSE-Android/1.0.0"
        }

        webView.addJavascriptInterface(NativeJsBridge(), "ReactNativeWebView")

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val uri = request?.url ?: return false
                val url = uri.toString()

                if (url.startsWith("about:") || url.startsWith("blob:") || url.startsWith("data:")) {
                    return false
                }

                val host = uri.host?.lowercase() ?: ""
                val isAllowedInApp =
                    host.endsWith("3dnurse.vercel.app") ||
                    host.endsWith("vercel.app") ||
                    url.contains("youtube.com/embed") ||
                    url.contains("youtube-nocookie.com/embed") ||
                    request.isForMainFrame == false

                if (isAllowedInApp) {
                    return false
                }

                return try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    true
                } catch (_: Exception) {
                    false
                }
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                view?.evaluateJavascript(INJECTED_BRIDGE_JS, null)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                view?.evaluateJavascript(INJECTED_BRIDGE_JS, null)
                if (!hasMainFrameError) {
                    hideLoadingOverlay()
                }
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    hasMainFrameError = true
                    val reason = error?.description?.toString() ?: "ERR_CONNECTION_FAILED"
                    errorDetailText.text =
                        "กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต (Wi-Fi หรือมือถือ)\nแล้วกดปุ่มด้านล่างเพื่อลองใหม่อีกครั้ง\n($reason)"
                    loadingOverlay.visibility = View.GONE
                    errorOverlay.visibility = View.VISIBLE
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                if (newProgress >= 90 && !hasMainFrameError) {
                    hideLoadingOverlay()
                }
            }

            override fun onShowCustomView(view: View?, callback: CustomViewCallback?) {
                if (customVideoView != null) {
                    callback?.onCustomViewHidden()
                    return
                }
                customVideoView = view
                customVideoCallback = callback
                if (view != null) {
                    fullscreenVideoContainer.addView(
                        view,
                        FrameLayout.LayoutParams(
                            FrameLayout.LayoutParams.MATCH_PARENT,
                            FrameLayout.LayoutParams.MATCH_PARENT
                        )
                    )
                    fullscreenVideoContainer.visibility = View.VISIBLE
                }
            }

            override fun onHideCustomView() {
                val video = customVideoView ?: return
                fullscreenVideoContainer.visibility = View.GONE
                fullscreenVideoContainer.removeView(video)
                customVideoView = null
                customVideoCallback?.onCustomViewHidden()
                customVideoCallback = null
            }
        }
    }

    private fun hideLoadingOverlay() {
        if (loadingOverlay.visibility != View.VISIBLE) return
        loadingOverlay.animate()
            .alpha(0f)
            .setDuration(260L)
            .withEndAction {
                loadingOverlay.visibility = View.GONE
                loadingOverlay.alpha = 1f
            }
            .start()
    }

    private fun setupSmartBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (customVideoView != null) {
                    webView.webChromeClient?.onHideCustomView()
                    return
                }

                if (loadingOverlay.visibility == View.VISIBLE || errorOverlay.visibility == View.VISIBLE) {
                    confirmOrExitApp()
                    return
                }

                webView.evaluateJavascript(SMART_BACK_JS) { rawResult ->
                    val handledInStore = rawResult?.contains("HANDLED") == true &&
                        !rawResult.contains("UNHANDLED")
                    if (handledInStore) {
                        triggerHaptic("HAPTIC_LIGHT")
                    } else if (webView.canGoBack()) {
                        webView.goBack()
                        triggerHaptic("HAPTIC_LIGHT")
                    } else {
                        confirmOrExitApp()
                    }
                }
            }
        })
    }

    private fun confirmOrExitApp() {
        val now = System.currentTimeMillis()
        if (now - lastBackPressMs < EXIT_CONFIRM_WINDOW_MS) {
            finish()
            return
        }
        lastBackPressMs = now
        Toast.makeText(
            this,
            "กดปุ่มย้อนกลับอีกครั้งเพื่อออกจากแอป 3DNURSE",
            Toast.LENGTH_SHORT
        ).show()
    }

    private fun triggerHaptic(type: String) {
        val durationMs = when (type) {
            "HAPTIC_HEAVY" -> 35L
            "HAPTIC_MEDIUM", "HAPTIC_SUCCESS" -> 22L
            else -> 12L
        }
        try {
            val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vm?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }
            if (vibrator?.hasVibrator() == true) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    vibrator.vibrate(
                        VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE)
                    )
                } else {
                    @Suppress("DEPRECATION")
                    vibrator.vibrate(durationMs)
                }
            }
        } catch (_: Exception) {
        }
    }

    private inner class NativeJsBridge {
        @JavascriptInterface
        fun postMessage(rawJson: String?) {
            if (rawJson.isNullOrBlank()) return
            try {
                val payload = JSONObject(rawJson)
                val eventType = payload.optString("type", "")
                runOnUiThread {
                    when (eventType) {
                        "HAPTIC_LIGHT", "HAPTIC_MEDIUM", "HAPTIC_HEAVY", "HAPTIC_SUCCESS", "HANDLED_BACK" -> {
                            triggerHaptic(eventType)
                        }
                        "CANNOT_GO_BACK" -> {
                            confirmOrExitApp()
                        }
                    }
                }
            } catch (_: Exception) {
            }
        }
    }

    private fun dp(value: Int): Int {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            value.toFloat(),
            resources.displayMetrics
        ).toInt()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        if (::webView.isInitialized) {
            webView.saveState(outState)
        }
    }

    override fun onResume() {
        super.onResume()
        if (::webView.isInitialized) {
            webView.onResume()
            webView.resumeTimers()
        }
    }

    override fun onPause() {
        if (::webView.isInitialized) {
            webView.onPause()
        }
        super.onPause()
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            (webView.parent as? ViewGroup)?.removeView(webView)
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }
}
