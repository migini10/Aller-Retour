import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../theme/theme_provider.dart';

class DriverSettingsScreen extends StatelessWidget {
  const DriverSettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text('Paramètres Chauffeur',
            style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          String themeText = 'Système';
          if (themeProvider.themeMode == ThemeMode.light) themeText = 'Clair';
          if (themeProvider.themeMode == ThemeMode.dark) themeText = 'Sombre';

          return ListView(
            padding: EdgeInsets.only(
              left: 16,
              right: 16,
              top: 16,
              bottom: MediaQuery.of(context).padding.bottom + 80,
            ),
            children: [
              ListTile(
                leading: Icon(Icons.dark_mode_outlined, color: Theme.of(context).colorScheme.onSurfaceVariant),
                title: Text('Thème de l\'application', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                subtitle: Text(themeText, style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant)),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    backgroundColor: Theme.of(context).scaffoldBackgroundColor,
                    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
                    builder: (context) {
                      return SafeArea(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Padding(
                              padding: EdgeInsets.all(16.0),
                              child: Text('Choisir le thème', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            ),
                            ListTile(
                              leading: const Icon(Icons.brightness_auto),
                              title: const Text('Système (Défaut)'),
                              trailing: themeProvider.themeMode == ThemeMode.system ? const Icon(Icons.check, color: Colors.green) : null,
                              onTap: () {
                                themeProvider.setThemeMode(ThemeMode.system);
                                Navigator.pop(context);
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.light_mode),
                              title: const Text('Clair'),
                              trailing: themeProvider.themeMode == ThemeMode.light ? const Icon(Icons.check, color: Colors.green) : null,
                              onTap: () {
                                themeProvider.setThemeMode(ThemeMode.light);
                                Navigator.pop(context);
                              },
                            ),
                            ListTile(
                              leading: const Icon(Icons.dark_mode),
                              title: const Text('Sombre'),
                              trailing: themeProvider.themeMode == ThemeMode.dark ? const Icon(Icons.check, color: Colors.green) : null,
                              onTap: () {
                                themeProvider.setThemeMode(ThemeMode.dark);
                                Navigator.pop(context);
                              },
                            ),
                          ],
                        ),
                      );
                    }
                  );
                },
              ),
            ],
          );
        }
      ),
    );
  }
}
