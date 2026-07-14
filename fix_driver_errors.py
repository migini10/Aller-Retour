import re
import json

# Fix driver_marketplace_screen.dart
file_marketplace = 'apps/mobile/lib/screens/driver/driver_marketplace_screen.dart'
with open(file_marketplace, 'r') as f:
    content = f.read()

content = content.replace("loadedColis = res.map((c) => {", "if (res.statusCode == 200) {\n        final data = jsonDecode(res.body) as List<dynamic>;\n        loadedColis = data.map((c) => {")
content = content.replace("if (res != null && res is List) loadedMissions = res;", "if (res.statusCode == 200) {\n          final data = jsonDecode(res.body) as List<dynamic>;\n          loadedMissions = data;\n        }")
content = content.replace("await ApiClient().patch('/v1/parcels/$id/status', {'status': nextStatus});", "await ApiClient().patch('/v1/parcels/$id/status', body: {'status': nextStatus});")
with open(file_marketplace, 'w') as f:
    f.write(content)

# Fix driver_localisation_screen.dart
file_local = 'apps/mobile/lib/screens/driver/driver_localisation_screen.dart'
with open(file_local, 'r') as f:
    content = f.read()

content = content.replace("final missionsResponse = await ApiClient().get('/v1/trips/search') as List<dynamic>?;", "final response = await ApiClient().get('/v1/trips/search');\n      if (response.statusCode == 200) {\n        final missionsResponse = jsonDecode(response.body) as List<dynamic>?;")
content = content.replace("final manifestResponse = await ApiClient().get('/v1/trips/$tripId/manifest');", "final responseM = await ApiClient().get('/v1/trips/$tripId/manifest');\n          if (responseM.statusCode == 200) {\n            final manifest = jsonDecode(responseM.body);")
# wait, 'manifest['tickets']' is used later.
