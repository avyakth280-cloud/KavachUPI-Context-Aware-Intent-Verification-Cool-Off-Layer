package in.kavachupi.shield

import android.content.Context
import android.hardware.display.DisplayManager
import android.media.AudioManager
import android.view.Display

class CoercionSensorService(private val context: Context) {

    data class DeviceTelemetry(
        val isCellularCallActive: Boolean,
        val isVoipCallActive: Boolean,
        val isScreenProjectionActive: Boolean,
        val activePresentationDisplays: Int
    ) {
        val isAnyCallActive: Boolean
            get() = isCellularCallActive || isVoipCallActive
    }

    fun captureTelemetry(): DeviceTelemetry {
        val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        val displayManager = context.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager

        val audioMode = audioManager.mode
        val isCellular = audioMode == AudioManager.MODE_IN_CALL
        val isVoip = audioMode == AudioManager.MODE_IN_COMMUNICATION

        val displays = displayManager.displays
        var externalDisplays = 0
        for (display in displays) {
            if (display.displayId != Display.DEFAULT_DISPLAY) {
                val isPresentation = (display.flags and Display.FLAG_PRESENTATION) != 0
                val isPrivate = (display.flags and Display.FLAG_PRIVATE) != 0
                if (isPresentation || isPrivate || display.state == Display.STATE_ON) {
                    externalDisplays++
                }
            }
        }

        return DeviceTelemetry(
            isCellularCallActive = isCellular,
            isVoipCallActive = isVoip,
            isScreenProjectionActive = externalDisplays > 0,
            activePresentationDisplays = externalDisplays
        )
    }
}