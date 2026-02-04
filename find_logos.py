import requests
import re
from urllib.parse import urljoin

urls = {
    "AlphaWave Semi": "https://awavesemi.com/",
    "KPM Power": "https://kpmpower.com/",
    "Ulkasemi": "https://ulkasemi.com/",
    "Pantheon Prototyping": "https://pantheondesign.ca/",  # Trying .ca for Canadian prototyping co? Or just search
    "Deadline Creative": "https://deadlinecreative.com/",
    "LES": "https://les.lassonde.yorku.ca/"
}

# Alternate URLs to try if above fail or just to cover bases
alternates = [
    "https://www.pantheonprototyping.com/", 
    "https://www.deadline.creative/",
    "https://lassonde.yorku.ca/student-life/clubs-and-associations"
]

def find_logos(url):
    print(f"--- Checking {url} ---")
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        response = requests.get(url, headers=headers, timeout=10)
        content = response.text
        
        # Look for img tags with logo in src, class, alt or id
        img_tags = re.findall(r'<img[^>]+>', content, re.IGNORECASE)
        
        count = 0
        for img in img_tags:
            if 'logo' in img.lower():
                # Extract src
                src_match = re.search(r'src=["\']([^"\']+)["\']', img, re.IGNORECASE)
                if src_match:
                    src = src_match.group(1)
                    full_url = urljoin(url, src)
                    print(f"Found candidate: {full_url}")
                    count += 1
                    if count >= 3: break
                    
        # Also check for og:image or similar
        og_image = re.search(r'<meta property="og:image" content=["\']([^"\']+)["\']', content, re.IGNORECASE)
        if og_image:
             print(f"OG Image: {og_image.group(1)}")

    except Exception as e:
        print(f"Failed: {e}")

for name, url in urls.items():
    find_logos(url)

for url in alternates:
    find_logos(url)
