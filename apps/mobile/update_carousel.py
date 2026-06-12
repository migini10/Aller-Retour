import os

file_path = '/Users/macbookair/Aller-Retour/apps/mobile/lib/screens/client/client_dashboard_screen.dart'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Add dart:async import
if "import 'dart:async';" not in content:
    content = content.replace("import 'dart:ui' as ui;", "import 'dart:ui' as ui;\nimport 'dart:async';")

# 2. Add State variables
old_state_vars = """class _ClientDashboardScreenState extends State<ClientDashboardScreen> with SingleTickerProviderStateMixin {
  AnimationController? _pulseController;
  Animation<double>? _pulseAnimation;
  final ScrollController _scrollController = ScrollController();"""

new_state_vars = """class _ClientDashboardScreenState extends State<ClientDashboardScreen> with SingleTickerProviderStateMixin {
  AnimationController? _pulseController;
  Animation<double>? _pulseAnimation;
  final ScrollController _scrollController = ScrollController();
  final PageController _promoController = PageController(viewportFraction: 0.85);
  Timer? _carouselTimer;"""

content = content.replace(old_state_vars, new_state_vars)

# 3. Add to initState
old_init_state = """    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.2, end: 0.6).animate(_pulseController!);
  }"""

new_init_state = """    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.2, end: 0.6).animate(_pulseController!);

    _carouselTimer = Timer.periodic(const Duration(seconds: 3), (Timer timer) {
      if (_promoController.hasClients) {
        int nextPage = _promoController.page!.round() + 1;
        if (nextPage > 1) { // We only have 2 pages
          nextPage = 0;
        }
        _promoController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }"""

content = content.replace(old_init_state, new_init_state)

# 4. Add to dispose
old_dispose = """  void dispose() {
    _scrollController.dispose();
    _pulseController?.dispose();
    super.dispose();
  }"""

new_dispose = """  void dispose() {
    _carouselTimer?.cancel();
    _promoController.dispose();
    _scrollController.dispose();
    _pulseController?.dispose();
    super.dispose();
  }"""

content = content.replace(old_dispose, new_dispose)

# 5. Use controller in _buildPromoCarousel
old_carousel = """  Widget _buildPromoCarousel(BuildContext context) {
    return SizedBox(
      height: 140,
      child: PageView(
        controller: PageController(viewportFraction: 0.85),
        children: ["""

new_carousel = """  Widget _buildPromoCarousel(BuildContext context) {
    return SizedBox(
      height: 140,
      child: PageView(
        controller: _promoController,
        children: ["""

content = content.replace(old_carousel, new_carousel)

with open(file_path, 'w') as f:
    f.write(content)
