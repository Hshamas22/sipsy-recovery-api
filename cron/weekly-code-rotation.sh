#!/bin/bash
set -e

WORKSPACE="/home/hshamas/.openclaw/workspace"
LOG_DIR="$WORKSPACE/logs"
LOG_FILE="$LOG_DIR/code-rotation-$(date +%Y-%m-%d).log"

mkdir -p "$LOG_DIR"

{
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] =========================================="
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] WEEKLY CODE ROTATION (Cleanup + Generate)"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] =========================================="
  echo ""

  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🧹 STEP 1: Removing expired codes..."
  bash "$WORKSPACE/.openclaw/cron/weekly-code-cleanup.sh" 2>&1 | tail -5
  echo ""

  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📝 STEP 2: Generating fresh code batches..."
  echo "[$(date '+%Y-%m-%d %H:%M:%S')]    - Email3 (200 codes: 100 cart + 100 checkout)"
  node "$WORKSPACE/.openclaw/cron/generate-codes.js" --batch email3 --count 100 2>&1 | grep -E "Total|✅"
  
  echo "[$(date '+%Y-%m-%d %H:%M:%S')]    - Email2 (200 codes: 100 cart + 100 checkout)"
  node "$WORKSPACE/.openclaw/cron/generate-codes.js" --batch email2 --count 100 2>&1 | grep -E "Total|✅"
  echo ""

  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 📊 STEP 3: Checking inventory levels..."
  node "$WORKSPACE/.openclaw/cron/code-inventory-check.js" 2>&1 | tail -10
  
  echo ""
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] =========================================="
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ COMPLETE"
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] =========================================="
} | tee -a "$LOG_FILE"
