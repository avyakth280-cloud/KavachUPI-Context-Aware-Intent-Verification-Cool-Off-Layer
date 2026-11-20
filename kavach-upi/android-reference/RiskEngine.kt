package in.kavachupi.shield

object RiskEngine {

    enum class Action {
        ALLOW_INSTANT,
        HOLD_PRE_DEBIT_CO_SIGNER,
        HOLD_PRE_DEBIT_SOLO_TIMER
    }

    data class TransactionContext(
        val amountInr: Double,
        val userThresholdInr: Double,
        val payeeVpa: String,
        val isFirstTimePayee: Boolean,
        val isCallerSavedInContacts: Boolean,
        val coSignerConfigured: Boolean,
        val telemetry: CoercionSensorService.DeviceTelemetry
    )

    data class EvaluationResult(
        val action: Action,
        val riskScore: Int,
        val triggeredReasons: List<String>,
        val coolOffMinutes: Int
    )

    fun evaluate(ctx: TransactionContext): EvaluationResult {
        val reasons = mutableListOf<String>()
        var score = 0

        if (ctx.telemetry.isScreenProjectionActive) {
            score += 60
            reasons.add("Active screen sharing / virtual display detected")
        }

        if (ctx.telemetry.isAnyCallActive && !ctx.isCallerSavedInContacts) {
            val callType = if (ctx.telemetry.isVoipCallActive) "VoIP/WhatsApp" else "Cellular"
            score += 45
            reasons.add("Active $callType call with unverified/unsaved caller")
        } else if (ctx.telemetry.isAnyCallActive) {
            score += 15
            reasons.add("Active call with saved contact")
        }

        if (ctx.isFirstTimePayee) {
            score += 20
            reasons.add("First-time recipient VPA (${ctx.payeeVpa})")
        }

        if (ctx.amountInr >= ctx.userThresholdInr) {
            score += 20
            reasons.add("Amount ₹${ctx.amountInr.toInt()} exceeds personal threshold ₹${ctx.userThresholdInr.toInt()}")
        }

        val hasCoercionSignal = ctx.telemetry.isScreenProjectionActive ||
            (ctx.telemetry.isAnyCallActive && !ctx.isCallerSavedInContacts)

        return if (hasCoercionSignal && score >= 60) {
            if (ctx.coSignerConfigured) {
                EvaluationResult(Action.HOLD_PRE_DEBIT_CO_SIGNER, score.coerceAtMost(100), reasons, 15)
            } else {
                EvaluationResult(Action.HOLD_PRE_DEBIT_SOLO_TIMER, score.coerceAtMost(100), reasons, 60)
            }
        } else {
            EvaluationResult(Action.ALLOW_INSTANT, score.coerceAtMost(100), reasons, 0)
        }
    }
}