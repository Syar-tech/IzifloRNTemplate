package iziflotemplatets;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.util.Log;
import android.view.KeyEvent;

import androidx.core.content.IntentCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;

import javax.annotation.Nullable;

public class IzifloCommonModule extends ReactContextBaseJavaModule {
    private static long[] sVIBRATE_OK_TIMING = new long[]{0, 100, 100, 100};
    private static long[] sVIBRATE_KO_TIMING = new long[]{0, 400, 100,100, 200, 400};
    private static long[] sVIBRATE_SCAN_TIMING = new long[]{0, 100, 100, 100};


    private static IzifloCommonModule instance = null;

    IzifloCommonModule(ReactApplicationContext context) {
        super(context);
    }

    public static IzifloCommonModule initKeyEventModule(ReactApplicationContext reactContext) {
        instance = new IzifloCommonModule(reactContext);
        return instance;
    }

    public static IzifloCommonModule getInstance() {
        return instance;
    }


    @ReactMethod
    public void getVersionCheckName(Promise promise) {
        promise.resolve(getReactApplicationContext().getString(R.string.version_check_mode));
    }

    @ReactMethod
    public void restartApp(){
        PackageManager packageManager = getReactApplicationContext().getPackageManager();
        Intent intent = packageManager.getLaunchIntentForPackage(getReactApplicationContext().getPackageName());
        ComponentName componentName = intent.getComponent();
        Intent mainIntent = Intent.makeRestartActivityTask(componentName);
        getReactApplicationContext().startActivity(mainIntent);
        Runtime.getRuntime().exit(0);
    }


    @Override
    public String getName() {
        return "IzifloCommonModule";
    }

}