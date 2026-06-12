import urllib.request, json, urllib.parse, re, os

def download_bing_image(query, filename):
    url = 'https://www.bing.com/images/search?q=' + urllib.parse.quote(query) + '&qft=+filterui:imagesize-medium'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        images = re.findall(r'murl&quot;:&quot;(http[^&]+?\.jpg)&quot;', html)
        if images:
            img_url = images[0]
            print(f"Downloading {filename} from {img_url}...")
            img_req = urllib.request.Request(img_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(img_req, timeout=10) as resp, open(filename, 'wb') as out_file:
                out_file.write(resp.read())
            return True
    except Exception as e:
        print(f"Failed {filename}: {e}")
    return False

dest_dir = 'apps/mobile/assets/images/destinations'
download_bing_image('Grande Mosquée de Touba Senegal', os.path.join(dest_dir, 'touba.jpg'))
download_bing_image('Marché de Kaolack Senegal', os.path.join(dest_dir, 'kaolack.jpg'))
