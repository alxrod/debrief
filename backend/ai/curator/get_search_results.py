from duckpy import Client
# https://github.com/AmanoTeam/duckpy

client = Client()

results = client.search("Lastest chat GPT news")
import json
print(json.dumps(results, indent=2))
