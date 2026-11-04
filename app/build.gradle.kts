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

    // Fester Schlüssel aus den GitHub-Secrets: Jede neue Version installiert sich über die alte, der Spielstand bleibt.
    val keyPass = System.getenv("HF_KEYSTORE_PASSWORD")
    val keyFile = rootProject.file("app/herzfaenger.keystore")
    signingConfigs {
        if (keyPass != null && keyFile.exists()) {
            create("herz") {
                storeFile = keyFile
                storePassword = keyPass
                keyAlias = "herzfaenger"
                keyPassword = keyPass
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.findByName("herz") ?: signingConfigs.getByName("debug")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
