#!/bin/bash
# Usage: ./log-action.sh "Actor" "Description" "type"
# Types: task, delegation, agent, completed, error, note, info

FILE="/Users/duljan/.openclaw/workspace/data/activity.json"
ACTOR="${1:-Klaus}"
ACTION="${2:-Unknown action}"
TYPE="${3:-info}"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Read, append, write
python3 -c "
import json
with open('$FILE','r') as f: data = json.load(f)
data.append({'ts':'$TS','actor':'$ACTOR','action':'$ACTION','type':'$TYPE'})
with open('$FILE','w') as f: json.dump(data, f, indent=2)
print('✅ Logged: $ACTION')
"
