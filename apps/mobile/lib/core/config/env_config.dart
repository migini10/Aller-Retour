import 'package:flutter_dotenv/flutter_dotenv.dart';

class EnvConfig {
  static String get apiUrl {
    final url = dotenv.env['API_URL'];
    if (url != null && url.isNotEmpty) {
      return url;
    }
    const isProduction = bool.fromEnvironment('dart.vm.product');
    if (isProduction) {
      throw Exception('API_URL is missing in production environment');
    }
    return 'http://10.0.2.2:3333';
  }
}
