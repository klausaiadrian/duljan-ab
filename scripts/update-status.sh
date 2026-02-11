#!/bin/bash
# Usage: ./update-status.sh "working|idle|offline" "What I'm doing"

FILE="/Users/duljan/.openclaw/workspace/data/status.json"
STATE="${1:-idle}"
TASK="${2:-}"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

python3 -c "
import json
data = {'state':'$STATE','task':'$TASK' if '$TASK' else None,'since':'$TS','subAgents':[]}
with open('$FILE','w') as f: json.dump(data, f, indent=2)
print('✅ Status: $STATE — $TASK')
"
