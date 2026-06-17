import json
import urllib.request

payload = {"nome":"Teste a","email":"teste.e2e@example.com","telefone":"(11) 99999-9999","cargo":"contratante","interesse":"Teste E2E","role":"contratante"}

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/pre-cadastro', data=data, headers={'Content-Type':'application/json'})
with urllib.request.urlopen(req) as r:
    print(r.read().decode('utf-8'))
