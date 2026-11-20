package in.kavachupi.shield

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class UpiIntentInterceptorActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val upiUri: Uri = intent?.data ?: run {
            finish()
            return
        }

        val payeeVpa = upiUri.getQueryParameter("pa") ?: "unknown@upi"
        val amount = upiUri.getQueryParameter("am")?.toDoubleOrNull() ?: 0.0

        val sensorService = CoercionSensorService(this)
        val telemetry = sensorService.captureTelemetry()

        val result = RiskEngine.evaluate(
            RiskEngine.TransactionContext(
                amountInr = amount,
                userThresholdInr = 2000.0,
                payeeVpa = payeeVpa,
                isFirstTimePayee = true,
                isCallerSavedInContacts = false,
                coSignerConfigured = true,
                telemetry = telemetry
            )
        )

        when (result.action) {
            RiskEngine.Action.ALLOW_INSTANT -> {
                val forwardIntent = Intent(Intent.ACTION_VIEW, upiUri).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                startActivity(forwardIntent)
                finish()
            }
            RiskEngine.Action.HOLD_PRE_DEBIT_CO_SIGNER,
            RiskEngine.Action.HOLD_PRE_DEBIT_SOLO_TIMER -> {
                // Render Pre-Debit Cool-Off Warning UI & dispatch context-rich push to Co-Signer
            }
        }
    }
}