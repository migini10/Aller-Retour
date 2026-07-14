import re
file_path = 'apps/mobile/lib/screens/driver/driver_missions_screen.dart'
with open(file_path, 'r') as f:
    content = f.read()

# I will fix everything that looks like '};' when it should be '});'
content = re.sub(r"setState\(\(\) \{\n\s+([\s\S]*?)\n\s+\};\n", r"setState(() {\n      \1\n    });\n", content)
content = re.sub(r"setModalState\(\(\) \{\n\s+([\s\S]*?)\n\s+\};\n", r"setModalState(() {\n      \1\n    });\n", content)
content = content.replace("dates.add({'value': val, 'label': f'{dayName} {dayStr} {monthName}'};", "dates.add({'value': val, 'label': f'{dayName} {dayStr} {monthName}'});")
content = content.replace("dates.add({'value': val, 'label': '$dayName $dayStr $monthName'};", "dates.add({'value': val, 'label': '$dayName $dayStr $monthName'});")
content = content.replace("availableDates.insert(0, {'value': date!, 'label': '$dayName $dayStr $monthName'};", "availableDates.insert(0, {'value': date!, 'label': '$dayName $dayStr $monthName'});")
content = content.replace("Colors.white, () {\n                                    return _buildActionButton(Icons.play_arrow, 'En route vers $destinationCity', const Color(0xFFEA580C), Colors.white, () {\n                                      Navigator.push(context, MaterialPageRoute(\n                                        builder: (context) => driver_live_tracking_screen.DriverLiveTrackingScreen(mission: mission),\n                                      ));\n                                    };\n                                  }\n                                )", "Colors.white, () {\n                                    return _buildActionButton(Icons.play_arrow, 'En route vers $destinationCity', const Color(0xFFEA580C), Colors.white, () {\n                                      Navigator.push(context, MaterialPageRoute(\n                                        builder: (context) => driver_live_tracking_screen.DriverLiveTrackingScreen(mission: mission),\n                                      ));\n                                    });\n                                  }\n                                )")

with open(file_path, 'w') as f:
    f.write(content)
