import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class PinStorageService {
  static const _storage = FlutterSecureStorage();
  static const _pinKey = 'driver_secure_pin';

  /// Saves the PIN securely
  static Future<void> savePin(String pin) async {
    await _storage.write(key: _pinKey, value: pin);
  }

  /// Retrieves the saved PIN. Returns null if no PIN is saved.
  static Future<String?> getPin() async {
    return await _storage.read(key: _pinKey);
  }

  /// Deletes the saved PIN (e.g., when it is incorrect)
  static Future<void> deletePin() async {
    await _storage.delete(key: _pinKey);
  }

  /// Checks if a PIN is currently stored securely
  static Future<bool> hasPin() async {
    final pin = await getPin();
    return pin != null && pin.isNotEmpty;
  }
}
