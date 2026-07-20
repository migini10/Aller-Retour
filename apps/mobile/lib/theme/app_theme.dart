import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // --- Couleurs Globales (Dark Theme actuel) ---
  static const Color darkScaffoldBg = Color(0xFF020617); // slate-950 (darker)
  static const Color darkCardBg = Color(0xFF0F172A); // slate-900
  static const Color darkDivider = Color(0xFF2A2A2A);
  static const Color primaryOrange = Color(0xFFF97316); // orange-500
  static const Color primaryCyan = Colors.cyanAccent;

  // --- Couleurs Globales (Light Theme) ---
  static const Color lightScaffoldBg = Color(0xFFF8FAFC); // slate-50
  static const Color lightCardBg = Colors.white;
  static const Color lightDivider = Color(0xFFE2E8F0); // slate-200
  static const Color lightTextPrimary = Color(0xFF0F172A); // slate-900
  static const Color lightTextSecondary = Color(0xFF475569); // slate-600

  static ThemeData get lightTheme {
    final baseTextTheme = const TextTheme(
      bodyLarge: TextStyle(color: lightTextPrimary),
      bodyMedium: TextStyle(color: lightTextPrimary),
      titleLarge: TextStyle(color: lightTextPrimary, fontWeight: FontWeight.bold),
      titleMedium: TextStyle(color: lightTextPrimary, fontWeight: FontWeight.bold),
      labelLarge: TextStyle(color: Colors.white, fontWeight: FontWeight.bold), // buttons text usually
    );

    return ThemeData(
      brightness: Brightness.light,
      primaryColor: primaryOrange,
      scaffoldBackgroundColor: lightScaffoldBg,
      cardColor: lightCardBg,
      dividerColor: lightDivider,
      colorScheme: const ColorScheme.light(
        primary: primaryOrange,
        secondary: primaryCyan,
        surface: lightCardBg,
        onSurface: lightTextPrimary,
        surfaceContainerHighest: Color(0xFFF1F5F9), // slate-100 (for secondary backgrounds)
        onSurfaceVariant: lightTextSecondary,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: lightScaffoldBg,
        elevation: 0,
        iconTheme: IconThemeData(color: lightTextPrimary),
        titleTextStyle: TextStyle(color: lightTextPrimary, fontSize: 18, fontWeight: FontWeight.bold),
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(baseTextTheme),
      iconTheme: const IconThemeData(color: lightTextPrimary),
      dividerTheme: const DividerThemeData(color: lightDivider, thickness: 1),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: lightCardBg,
        elevation: 8,
        shadowColor: Color(0x1A000000),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      ),
      cardTheme: const CardThemeData(
        elevation: 4,
        shadowColor: Color(0x0A000000),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(24))),
        color: lightCardBg,
        margin: EdgeInsets.zero,
      ),
    );
  }

  static ThemeData get darkTheme {
    final baseTextTheme = const TextTheme(
      bodyLarge: TextStyle(color: Colors.white),
      bodyMedium: TextStyle(color: Colors.white),
      titleLarge: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
      titleMedium: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
    );

    return ThemeData(
      brightness: Brightness.dark,
      primaryColor: primaryOrange,
      scaffoldBackgroundColor: darkScaffoldBg,
      cardColor: darkCardBg,
      dividerColor: darkDivider,
      colorScheme: const ColorScheme.dark(
        primary: primaryOrange,
        secondary: primaryCyan,
        surface: darkCardBg,
        onSurface: Colors.white,
        surfaceContainerHighest: Color(0xFF1E293B), // slate-800
        onSurfaceVariant: Colors.white70,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: darkScaffoldBg,
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white),
        titleTextStyle: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(baseTextTheme),
      iconTheme: const IconThemeData(color: Colors.white),
      dividerTheme: const DividerThemeData(color: darkDivider, thickness: 1),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: darkCardBg,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      ),
    );
  }
}
