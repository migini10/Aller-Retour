import urllib.request
import os

urls = {
    'dakar.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/African_Renaissance_Monument_%285502494604%29.jpg/960px-African_Renaissance_Monument_%285502494604%29.jpg',
    'touba.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/La_grande_mosqu%C3%A9e_de_Touba.jpg/960px-La_grande_mosqu%C3%A9e_de_Touba.jpg',
    'thies.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Thi%C3%A8sCarrefour.JPG/960px-Thi%C3%A8sCarrefour.JPG',
    'mbour.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/M%27bour_harbor.jpeg/960px-M%27bour_harbor.jpeg',
    'kaolack.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/KaolackCommerce.JPG/960px-KaolackCommerce.JPG',
    'saint_louis.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Saintlouis_pont_Faidherbe.jpg/960px-Saintlouis_pont_Faidherbe.jpg'
}

dest_dir = 'apps/mobile/assets/images/destinations'
os.makedirs(dest_dir, exist_ok=True)

for filename, url in urls.items():
    path = os.path.join(dest_dir, filename)
    print(f"Downloading {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            out_file.write(response.read())
    except Exception as e:
        print(f"Failed to download {filename}: {e}")

