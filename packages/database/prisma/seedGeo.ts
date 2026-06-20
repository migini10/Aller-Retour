import { prisma } from '../src/index'
import geoData from '../data/senegal_geo.json'

async function main() {
  console.log('Seeding Geographic Data...')

  const country = await prisma.geoCountry.create({
    data: {
      name: geoData.country.name,
      code: geoData.country.code,
      currency: geoData.country.currency,
    }
  })

  for (const r of geoData.regions) {
    const region = await prisma.geoRegion.create({ data: { name: r.name, countryId: country.id } })
    
    for (const d of r.departments || []) {
      const dept = await prisma.geoDepartment.create({ data: { name: d.name, regionId: region.id } })
      
      for (const c of d.cities || []) {
        const city = await prisma.geoCity.create({ data: { name: c.name, departmentId: dept.id } })
        
        for (const com of c.communes || []) {
          const commune = await prisma.geoCommune.create({ data: { name: com.name, cityId: city.id } })
          
          for (const q of com.quarters || []) {
            const quarter = await prisma.geoQuarter.create({ data: { name: q.name, communeId: commune.id } })
            
            for (const sq of q.subQuarters || []) {
              const subQ = await prisma.geoSubQuarter.create({ data: { name: sq.name, quarterId: quarter.id } })
              
              for (const l of sq.landmarks || []) {
                await prisma.geoLandmark.create({ data: { name: l.name, latitude: l.lat, longitude: l.lng, subQuarterId: subQ.id } })
              }
            }
            
            for (const l of q.landmarks || []) {
              await prisma.geoLandmark.create({ data: { name: l.name, latitude: l.lat, longitude: l.lng } })
            }
          }
        }
      }
    }
  }

  console.log('Geographic Seeding Completed!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
