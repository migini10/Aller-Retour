import sys

def patch():
    filepath = 'apps/api/src/modules/bookings/bookings.service.ts'
    with open(filepath, 'r') as f:
        content = f.read()

    new_func = """  async getQrInfoAtBoarding(qrCodeToken: string) {
    // Decode and verify secure token
    const parsedPayload = this.qrService.verifyQrToken(qrCodeToken);

    const booking = await prisma.booking.findUnique({
      where: { qrCodeToken },
      include: { 
        user: true, 
        trip: { 
          include: { 
            route: { include: { originStation: true, destinationStation: true } } 
          } 
        } 
      },
    });

    if (!booking) throw new NotFoundException("Billet QR invalide ou inexistant.");
    
    // Check if expired
    const isPast = new Date(booking.trip.departureTime).getTime() < Date.now();
    const tripStatus = booking.trip.status;
    let isExpired = false;
    if (['COMPLETED', 'ARRIVED', 'CANCELLED'].includes(tripStatus)) isExpired = true;
    if (isPast && !['SCHEDULED', 'BOARDING'].includes(tripStatus)) isExpired = true;

    if (booking.status === 'BOARDED') {
      return { 
        status: 'already_used', 
        message: 'Ce billet a déjà été scanné.',
        ticketId: booking.id,
        boardedAt: booking.boardedAt,
        passengerName: booking.user.fullName,
        seatNumber: booking.seatNumber,
        route: `${booking.trip.route.originStation.city} ➔ ${booking.trip.route.destinationStation.city}`
      };
    }
    
    if (booking.status === 'CANCELLED') {
        return { status: 'invalid', message: 'Billet annulé' };
    }

    return { 
      status: isExpired ? 'expired' : 'valid', 
      message: isExpired ? 'Billet expiré.' : 'Billet valide pour embarquement.',
      ticketId: booking.id,
      passengerName: booking.user.fullName,
      seatNumber: booking.seatNumber,
      route: `${booking.trip.route.originStation.city} ➔ ${booking.trip.route.destinationStation.city}`,
      amountPaid: booking.amountPaid,
      departureTime: booking.trip.departureTime,
      qrCodeToken: booking.qrCodeToken,
      passengersCount: 1
    };
  }
"""
    if "async getQrInfoAtBoarding" not in content:
        content = content.replace("  async verifyQrAtBoarding(qrCodeToken: string) {", new_func + "\n  async verifyQrAtBoarding(qrCodeToken: string) {")
        with open(filepath, 'w') as f:
            f.write(content)
        print("Patched bookings.service.ts")

patch()
