import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class OfflineDatabase {
  static final OfflineDatabase instance = OfflineDatabase._init();
  static Database? _database;

  OfflineDatabase._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await init();
    return _database!;
  }

  Future<Database> init() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'aller_retour_offline.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future _createDB(Database db, int version) async {
    // Table de cache pour les billets et manifestes passagers
    await db.execute('''
      CREATE TABLE cached_tickets (
        id TEXT PRIMARY KEY,
        tripId TEXT,
        seatNumber INTEGER,
        passengerName TEXT,
        qrCodeToken TEXT,
        isBoarded INTEGER DEFAULT 0
      )
    ''');
  }

  Future<void> cacheManifest(List<Map<String, dynamic>> tickets) async {
    final db = await instance.database;
    final batch = db.batch();
    for (var ticket in tickets) {
      batch.insert('cached_tickets', ticket, conflictAlgorithm: ConflictAlgorithm.replace);
    }
    await batch.commit(noResult: true);
  }

  Future<bool> verifyQrTokenLocal(String qrToken) async {
    final db = await instance.database;
    final res = await db.query(
      'cached_tickets',
      where: 'qrCodeToken = ?',
      whereArgs: [qrToken],
    );
    if (res.isNotEmpty) {
      final ticketId = res.first['id'] as String;
      await db.update('cached_tickets', {'isBoarded': 1}, where: 'id = ?', whereArgs: [ticketId]);
      return true;
    }
    return false;
  }
}
