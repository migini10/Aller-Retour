import 'package:flutter/material.dart';

class SharedHeader extends StatelessWidget {
  final ScrollController scrollController;
  final VoidCallback? onLogoTap;

  const SharedHeader({
    super.key,
    required this.scrollController,
    this.onLogoTap,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: scrollController,
      builder: (context, child) {
        double opacity = 1.0;
        double translateX = 0.0;
        if (scrollController.hasClients) {
          double offset = scrollController.offset;
          opacity = (1 - (offset / 100)).clamp(0.0, 1.0);
          translateX = (offset / 2).clamp(0.0, 50.0);
        }
        
        return Opacity(
          opacity: opacity,
          child: Transform.translate(
            offset: Offset(translateX, 0),
            child: child,
          ),
        );
      },
      child: _buildHeaderContent(context),
    );
  }

  Widget _buildHeaderContent(BuildContext context) {
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
            onTap: onLogoTap ?? () {
              // Default to pop if possible, otherwise go to home
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
