#!/bin/bash

if [ -z "$NOTION_TOKEN" ]; then
  echo "ERROR: NOTION_TOKEN environment variable not set"
  exit 1
fi

TOKEN="$NOTION_TOKEN"
DB_ID="33696b2b820681a28a85cb68dfb5650b"
TODAY=$(date +%Y-%m-%d)

curl -s -X POST https://api.notion.com/v1/pages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d '{
    "parent": {"database_id": "'$DB_ID'"},
    "properties": {
      "title": {
        "title": [
          {"text": {"content": "'$(date +%B\ %d)' - Daily Summary"}}
        ]
      }
    },
    "children": [
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {"rich_text": [{"type": "text", "text": {"content": "To be filled in at end of day"}}]}
      }
    ]
  }' > /dev/null 2>&1

echo "Daily summary created for $TODAY"
