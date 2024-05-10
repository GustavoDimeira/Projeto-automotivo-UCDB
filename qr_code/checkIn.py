import qrcode

url_id = 1
url = f'https://gustavodimeira.github.io/web-page/fron_end/check_in?url_id={url_id}'

# Gerar a imagem do QR code
img = qrcode.make(url)

# Salvar a imagem do QR code
img.save(f"url_{url_id}.jpg")

print("QR code gerado com sucesso!")