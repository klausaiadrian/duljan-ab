#!/bin/bash
# Usage: ./add-note.sh "Author" "Note text"

FILE="/Users/duljan/.openclaw/workspace/data/notes.json"
FROM="${1:-Adrian}"
TEXT="${2:-}"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

python3 -c "
import json
with open('$FILE','r') as f: data = json.load(f)
data.append({'ts':'$TS','from':'$FROM','text':'$TEXT','seen':False})
with open('$FILE','w') as f: json.dump(data, f, indent=2)
print('✅ Note added: $TEXT')
"
