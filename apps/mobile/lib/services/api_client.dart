import 'package:aller_retour_mobile/core/config/env_config.dart';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../core/constants/storage_keys.dart';

class UnauthorizedException implements Exception {
  final String message;
  UnauthorizedException([this.message = 'Unauthorized access']);

  @override
  String toString() => 'UnauthorizedException: $message';
}

class AccountNotVerifiedException implements Exception {
  final String message;
  AccountNotVerifiedException([this.message = 'Account not verified']);

  @override
  String toString() => 'AccountNotVerifiedException: $message';
}

class ApiException implements Exception {
  final int statusCode;
  final String message;
  final dynamic data;

  ApiException(this.statusCode, this.message, {this.data});

  @override
  String toString() => 'ApiException: $statusCode - $message';
}

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  static const int _timeoutSeconds = 15;

  String get baseUrl {
    // Priority to API_URL (NestJS). Fallback to emulator localhost if missing.
    return EnvConfig.apiUrl;
  }

  Future<Map<String, String>> _getHeaders({bool requireAuth = true}) async {
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
    };

    if (requireAuth) {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(StorageKeys.authToken);
      if (token != null && token.isNotEmpty) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  void _handleErrors(http.Response response) async {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return; // Success
    }

    String errorMessage = 'Erreur réseau inconnue';
    dynamic responseData;
    
    try {
      responseData = json.decode(response.body);
      if (responseData is Map && responseData['message'] != null) {
        errorMessage = responseData['message'].toString();
      }
    } catch (e) {
      // Not JSON, fallback to status reason phrase
      errorMessage = response.reasonPhrase ?? 'Erreur du serveur';
    }

    if (response.statusCode == 401 || response.statusCode == 403) {
      if (response.statusCode == 403 && errorMessage == 'ACCOUNT_NOT_VERIFIED') {
        throw AccountNotVerifiedException(errorMessage);
      }
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(StorageKeys.authToken);
      await prefs.remove(StorageKeys.userRole);
      throw UnauthorizedException('Session expired or unauthorized');
    }

    throw ApiException(response.statusCode, errorMessage, data: responseData);
  }

  Future<http.Response> get(String endpoint, {bool requireAuth = true}) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(requireAuth: requireAuth);
    
    final response = await http
        .get(uri, headers: headers)
        .timeout(const Duration(seconds: _timeoutSeconds));

    _handleErrors(response);
    return response;
  }

  Future<http.Response> post(String endpoint, {dynamic body, bool requireAuth = true}) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(requireAuth: requireAuth);

    final response = await http
        .post(uri, headers: headers, body: body != null ? json.encode(body) : null)
        .timeout(const Duration(seconds: _timeoutSeconds));

    _handleErrors(response);
    return response;
  }

  Future<http.Response> patch(String endpoint, {dynamic body, bool requireAuth = true}) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(requireAuth: requireAuth);

    final response = await http
        .patch(uri, headers: headers, body: body != null ? json.encode(body) : null)
        .timeout(const Duration(seconds: _timeoutSeconds));

    _handleErrors(response);
    return response;
  }

  Future<http.Response> delete(String endpoint, {bool requireAuth = true}) async {
    final uri = Uri.parse('$baseUrl$endpoint');
    final headers = await _getHeaders(requireAuth: requireAuth);

    final response = await http
        .delete(uri, headers: headers)
        .timeout(const Duration(seconds: _timeoutSeconds));

    _handleErrors(response);
    return response;
  }

  Future<http.Response> multipartRequest(
    String method,
    String path, {
    Map<String, String>? fields,
    Map<String, File>? files,
  }) async {
    try {
      final uri = Uri.parse('$baseUrl$path');
      final request = http.MultipartRequest(method, uri);

      final headers = await _getHeaders(requireAuth: true);
      headers.remove('Content-Type'); // Let multipart set its own boundary
      request.headers.addAll(headers);

      if (fields != null) {
        request.fields.addAll(fields);
      }

      if (files != null) {
        for (var entry in files.entries) {
          final file = entry.value;
          request.files.add(await http.MultipartFile.fromPath(
            entry.key,
            file.path,
          ));
        }
      }

      print('=== MULTIPART REQUEST DEBUG ===');
      print('URL: $method $uri');
      print('Headers: ${request.headers}');
      print('Fields: ${request.fields}');
      print('Files: ${request.files.map((f) => '${f.field}: ${f.filename} (${f.length} bytes)').toList()}');
      print('===============================');

      final streamedResponse = await request.send().timeout(const Duration(seconds: 30));
      final response = await http.Response.fromStream(streamedResponse);
      
      print('=== MULTIPART RESPONSE DEBUG ===');
      print('StatusCode: ${response.statusCode}');
      print('Body: ${response.body}');
      print('================================');
      _handleErrors(response);
      return response;
    } catch (e) {
      if (e is ApiException || e is UnauthorizedException || e is AccountNotVerifiedException) rethrow;
      throw ApiException(500, 'Network error: $e');
    }
  }
}
