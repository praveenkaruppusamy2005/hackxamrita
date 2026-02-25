import sys, json, urllib.request

try:
    with urllib.request.urlopen("http://127.0.0.1:4040/api/requests/http") as url:
        data = json.loads(url.read().decode())
        for r in data.get('requests', [])[:10]:
            print(f"{r['request']['method']} {r['request']['uri']} -> {r['response']['status_code']}")
            if r['request']['method'] == 'POST':
                print(f"  Params: {r['request'].get('raw_query', '') or r['request'].get('body', '')[:100]}")
            if r['response']['status_code'] >= 400:
                print("Error Details:")
                print(r['response'].get('body', 'No body in ngrok log'))
except Exception as e:
    print(f"Error: {e}")
