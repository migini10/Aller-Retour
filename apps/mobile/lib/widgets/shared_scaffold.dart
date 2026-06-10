import 'package:flutter/material.dart';
import 'app_drawer.dart';

class SharedScaffold extends StatefulWidget {
  final Widget body;
  final bool isDriverMode;

  const SharedScaffold({
    super.key,
    required this.body,
    this.isDriverMode = false,
  });

  @override
  State<SharedScaffold> createState() => _SharedScaffoldState();
}

class _SharedScaffoldState extends State<SharedScaffold> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF020617), // slate-950
      endDrawer: AppDrawer(isDriverMode: widget.isDriverMode),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 550),
          child: SingleChildScrollView(
            controller: _scrollController,
            physics: const BouncingScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AnimatedBuilder(
                  animation: _scrollController,
                  builder: (context, child) {
                    double offset = _scrollController.hasClients ? _scrollController.offset : 0;
                    double opacity = (1 - (offset / 35)).clamp(0.0, 1.0);
                    double translateX = -(offset * 3).clamp(0.0, 200.0);
                    
                    return Opacity(
                      opacity: opacity,
                      child: Transform.translate(
                        offset: Offset(translateX, 0),
                        child: child,
                      ),
                    );
                  },
                  child: _buildHeader(context),
                ),
                widget.body,
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      color: Colors.transparent,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        bottom: 16,
        left: 20,
        right: 20,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo
          GestureDetector(
            onTap: () {
              if (Navigator.canPop(context)) {
                Navigator.pop(context);
              } else {
                Navigator.pushReplacementNamed(context, '/home');
              }
            },
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: Colors.orange.withOpacity(0.4),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.deepOrange.shade400, width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Icon(Icons.directions_car, color: Colors.deepOrange.shade400, size: 18),
                ),
                const SizedBox(width: 10),
                RichText(
                  text: TextSpan(
                    style: const TextStyle(
                      fontWeight: FontWeight.w900, 
                      fontSize: 24,
                      letterSpacing: -0.5,
                      fontFamily: 'Roboto',
                      shadows: [
                        Shadow(color: Colors.black87, blurRadius: 6, offset: Offset(0, 2)),
                      ],
                    ),
                    children: [
                      const TextSpan(text: 'Aller-', style: TextStyle(color: Colors.white)),
                      TextSpan(text: 'Retour', style: TextStyle(color: Colors.deepOrange.shade400)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Hamburger Menu
          Container(
            decoration: BoxDecoration(
              color: const Color(0xFF0F172A).withOpacity(0.6),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withOpacity(0.15)),
            ),
            child: IconButton(
              icon: const Icon(Icons.menu, color: Colors.white, size: 26),
              onPressed: () {
                Scaffold.of(context).openEndDrawer();
              },
            ),
          ),
        ],
      ),
    );
  }
}
