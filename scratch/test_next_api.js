async function main() {
  const body = {
    originCity: 'Dakar',
    destinationCity: 'Touba',
    pricePerSeat: 10000,
    departureTime: new Date('2026-06-15T04:30:00').toISOString(),
    placesLibres: 4,
    vehicleCapacity: 5,
    passagers: 0,
    isAirConditioned: true,
    takesTollRoad: true
  };

  try {
    console.log("Sending POST request to http://localhost:3000/api/missions ...");
    const res = await fetch('http://localhost:3000/api/missions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    console.log("Response Status:", res.status);
    const text = await res.text();
    console.log("Response Text:", text);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

main();
