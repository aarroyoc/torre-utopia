package io.github.adrianarroyocalle.skeleton_npm_game;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.*;

public class MainActivity extends Activity
{
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        //super.onCreate(savedInstanceState);
        //setContentView(R.layout.main);
        WebView wv=new WebView(this);
        WebSettings settings=wv.getSettings();
        settings.setJavaScriptEnabled(true);
        wv.setWebViewClient(new WebViewClient());
        wv.loadUrl("file://android_asset/index.html");
        setContentView(wv);
    }
}
