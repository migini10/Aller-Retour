import 'package:flutter/material.dart';

class OrangeMoneyLogo extends StatelessWidget {
  final double size;
  
  const OrangeMoneyLogo({super.key, this.size = 24.0});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _OrangeMoneyPainter(),
      ),
    );
  }
}

class _OrangeMoneyPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // The original SVG viewBox is 0 0 512 512
    final double scaleX = size.width / 512.0;
    final double scaleY = size.height / 512.0;
    final double scale = scaleX < scaleY ? scaleX : scaleY;
    
    // Center the drawing if aspect ratio is not 1:1
    final double dx = (size.width - (512 * scale)) / 2;
    final double dy = (size.height - (512 * scale)) / 2;
    
    canvas.translate(dx, dy);
    canvas.scale(scale, scale);

    // Black background
    final paintBg = Paint()..color = Colors.black;
    // adding small border radius equivalent
    canvas.drawRRect(RRect.fromRectAndRadius(const Rect.fromLTWH(0, 0, 512, 512), const Radius.circular(60)), paintBg);

    // White arrow
    final paintWhite = Paint()..color = const Color(0xFFFFFFFF);
    final pathWhite = Path()
      ..moveTo(80, 175)
      ..cubicTo(80, 150, 100, 130, 125, 130)
      ..lineTo(220, 130)
      ..cubicTo(245, 130, 260, 145, 260, 170)
      ..lineTo(260, 270)
      ..cubicTo(260, 295, 245, 310, 220, 310)
      ..cubicTo(195, 310, 180, 295, 180, 270)
      ..lineTo(180, 235)
      ..lineTo(125, 290)
      ..cubicTo(108, 307, 82, 307, 65, 290)
      ..cubicTo(48, 273, 48, 247, 65, 230)
      ..lineTo(120, 175)
      ..lineTo(80, 175)
      ..close();
    canvas.drawPath(pathWhite, paintWhite);

    // Orange arrow
    final paintOrange = Paint()..color = const Color(0xFFFF7900);
    final pathOrange = Path()
      ..moveTo(300, 242)
      ..lineTo(355, 187)
      ..cubicTo(372, 170, 398, 170, 415, 187)
      ..cubicTo(432, 204, 432, 230, 415, 247)
      ..lineTo(360, 302)
      ..lineTo(405, 302)
      ..cubicTo(430, 302, 450, 322, 450, 347)
      ..cubicTo(450, 372, 430, 392, 405, 392)
      ..lineTo(300, 392)
      ..cubicTo(275, 392, 260, 377, 260, 352)
      ..lineTo(260, 300)
      ..cubicTo(260, 275, 275, 260, 300, 260)
      ..close();
    canvas.drawPath(pathOrange, paintOrange);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
