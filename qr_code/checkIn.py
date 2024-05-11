import qrcode

url = f'https://gustavodimeira.github.io/web-page/front_end/check_in'

img = qrcode.make(url)
img.save(f"url.jpg")

print("QR code gerado com sucesso!")