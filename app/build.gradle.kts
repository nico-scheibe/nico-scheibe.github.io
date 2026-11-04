plugins {
    id("com.android.application")
}

android {
    namespace = "de.nico.herzfaenger"
    compileSdk = 35

    defaultConfig {
        applicationId = "de.nico.herzfaenger"
        minSdk = 24
        targetSdk = 35
        // Jede neue Version aus GitHub bekommt automatisch eine höhere Nummer, damit sie sich über die alte installieren lässt
        val build = (System.getenv("GITHUB_RUN_NUMBER") ?: "1").toInt()
        versionCode = build
        versionName = "1.$build"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Zum einfachen Installieren wird auch die Release-Version mit dem Debug-Schlüssel signiert.
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
