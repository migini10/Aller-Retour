import 'package:flutter/material.dart';
import 'app_drawer.dart';

class SharedScaffold extends StatefulWidget {
  final Widget body;
  final bool isDriverMode;
  final String? title;
  final String? subtitle;
  final IconData? icon;
  final Color? iconColor;
  final Future<void> Function()? onRefresh;

  const SharedScaffold({
    super.key,
    required this.body,
    this.isDriverMode = false,
    this.title,
    this.subtitle,
    this.icon,
    this.iconColor,
    this.onRefresh,
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
      backgroundColor: Theme.of(context).scaffoldBackgroundColor, // slate-950
      endDrawer: AppDrawer(isDriverMode: widget.isDriverMode),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 550),
          child: Stack(
            children: [
              RefreshIndicator(
                onRefresh: widget.onRefresh ?? () async {
                  // Default refresh action if none provided
                  await Future.delayed(const Duration(milliseconds: 1500));
                },
                color: Colors.orangeAccent,
                backgroundColor: Theme.of(context).cardColor,
                child: SingleChildScrollView(
                  controller: _scrollController,
                  physics: const BouncingScrollPhysics(parent: AlwaysScrollableScrollPhysics()),
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
                      child: _buildHeaderLogo(context),
                    ),
                    if (widget.title != null)
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                if (widget.icon != null) ...[
                                  Icon(widget.icon, color: widget.iconColor ?? Colors.blueAccent, size: 28),
                                  const SizedBox(width: 12),
                                ],
                                Expanded(
                                  child: Text(
                                    widget.title!,
                                    style: TextStyle(color: Theme.of(context).colorScheme.onSurface,
                                      fontSize: 28,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: -0.5,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            if (widget.subtitle != null) ...[
                              const SizedBox(height: 6),
                              Text(
                                widget.subtitle!,
                                style: TextStyle(color: Theme.of(context).colorScheme.onSurfaceVariant,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                            const SizedBox(height: 8),
                            Divider(color: Theme.of(context).dividerColor.withValues(alpha: 0.5)),
                          ],
                        ),
                      ),
                    widget.body,
                    SizedBox(height: MediaQuery.of(context).padding.bottom + 24),
                  ],
                ),
              ),
              ),
              // Fixed Hamburger Menu
              Positioned(
                top: MediaQuery.of(context).padding.top + 16,
                right: 20,
                child: _buildHamburgerMenu(context),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeaderLogo(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      color: Colors.transparent,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        bottom: 16,
        left: 20,
        right: 80,
      ),
      child: GestureDetector(
        onTap: () {
          if (Navigator.canPop(context)) {
            Navigator.pop(context);
          } else {
            Navigator.pushNamedAndRemoveUntil(context, '/', (r) => false);
          }
        },
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.2) : const Color(0xFFFFEDD5),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.3) : const Color(0xFFFED7AA), width: 1.5),
              ),
              child: const Icon(Icons.directions_car, color: Color(0xFFF97316), size: 18),
            ),
            const SizedBox(width: 10),
            RichText(
              text: TextSpan(
                style: const TextStyle(
                  fontWeight: FontWeight.w900, 
                  fontSize: 24,
                  letterSpacing: -0.5,
                  fontFamily: 'Roboto',
                ),
                children: [
                  TextSpan(text: 'Aller-', style: TextStyle(color: Theme.of(context).colorScheme.onSurface)),
                  const TextSpan(text: 'Retour', style: TextStyle(color: Color(0xFFF97316))),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHamburgerMenu(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.1) : const Color(0xFFFFF7ED),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isDark ? const Color(0xFFF97316).withValues(alpha: 0.3) : const Color(0xFFFED7AA), width: 1),
        boxShadow: [
          if (!isDark) BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 6, offset: const Offset(0, 3)),
        ],
      ),
      child: Builder(
        builder: (innerContext) {
          return IconButton(
            icon: Icon(Icons.menu, color: isDark ? const Color(0xFFFB923C) : const Color(0xFFF97316), size: 20),
            padding: const EdgeInsets.all(8),
            constraints: const BoxConstraints(),
            onPressed: () {
              Scaffold.of(innerContext).openEndDrawer();
            },
          );
        }
      ),
    );
  }
}
