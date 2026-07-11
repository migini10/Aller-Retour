import 'dart:convert';

class JwtUtils {
  static String? decodeRole(String token) {
    try {
      final parts = token.split('.');
      if (parts.length != 3) {
        return null;
      }
      
      final payload = parts[1];
      final String normalized = base64Url.normalize(payload);
      final String resp = utf8.decode(base64Url.decode(normalized));
      
      final payloadMap = jsonDecode(resp);
      
      if (payloadMap is Map<String, dynamic> && payloadMap.containsKey('role')) {
        return payloadMap['role'];
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
