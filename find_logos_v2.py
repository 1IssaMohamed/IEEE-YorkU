import requests
import re
from urllib.parse import urljoin

urls_to_scan = [
    "https://awavesemi.com/",
    "http://pantheonprototyping.com",
    "http://deadlinecreative.com",
    "https://lassonde.yorku.ca/student-life/clubs-and-associations",
    "https://www.google.com/search?q=Pantheon+Prototyping",
    "https://www.google.com/search?q=Deadline+Creative"
]

def scan_images(url):
    print(f"--- Scanning {url} ---")
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
        response = requests.get(url, headers=headers, timeout=10)
        content = response.text
        
        # All imgs
        img_tags = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content, re.IGNORECASE)
        print(f"Found {len(img_tags)} images.")
        
        # Check for specific "logo" in filename
        for src in img_tags:
            if "logo" in src.lower() or "brand" in src.lower():
                full_url = urljoin(url, src)
                print(f"  [POTENTIAL LOGO]: {full_url}")
            # Also check for SVG in general
            if src.lower().endswith(".svg"):
                full_url = urljoin(url, src)
                print(f"  [SVG]: {full_url}")

    except Exception as e:
        print(f"Failed to scan {url}: {e}")

if __name__ == "__main__":
    for u in urls_to_scan:
        scan_images(u)
