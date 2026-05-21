#!/bin/bash

WORKSPACE="/home/hshamas/.openclaw/workspace"
LOG_FILE="$WORKSPACE/logs/monday-pricing-$(date +%Y%m%d).log"

echo "=== MONDAY COMPETITOR PRICING REPORT ===" >> $LOG_FILE
echo "Started: $(date)" >> $LOG_FILE

node "$WORKSPACE/.openclaw/cron/monday-competitor-pricing.js" >> $LOG_FILE 2>&1

echo "Completed: $(date)" >> $LOG_FILE
