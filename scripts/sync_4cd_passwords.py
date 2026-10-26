#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
sync_4cd_passwords.py
Batch sync 4C/4D student credentials to Google Form.

Google Form URL:
  https://docs.google.com/forms/u/0/d/e/1FAIpQLSeLZ6E4kLjJ26aWrKRPRPtDdthkxRHqOPX5AOwAq8_TYiT-OQ/formResponse

Field Mapping:
  entry.543502435  -> 班別 (Class, e.g. "4C", "4D")
  entry.1745113091 -> 學號 (Student ID, e.g. "1", "2")
  entry.1972335137 -> 姓名/標籤 (Name / Tag, e.g. "古永晴")
  entry.2095507383 -> 口令密鑰 (Password Key, e.g. "4C01-X33C")

Existing GAS Reader Endpoint (Reused, No new GAS created):
  https://script.google.com/macros/s/AKfycbwNAQNxmNsNa8rWGp48qnYRrjA2WFLGIzKqSel2r8MilRp59s3ZfBJjeKXIrUfoS-Zp-g/exec
"""

import os
import sys
import csv
import time
import argparse
import urllib.parse
import urllib.request
import ssl

if sys.platform == "win32":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")


FORM_RESPONSE_URL = (
    "https://docs.google.com/forms/u/0/d/e/"
    "1FAIpQLSeLZ6E4kLjJ26aWrKRPRPtDdthkxRHqOPX5AOwAq8_TYiT-OQ/formResponse"
)

GAS_ENDPOINT_URL = (
    "https://script.google.com/macros/s/"
    "AKfycbwNAQNxmNsNa8rWGp48qnYRrjA2WFLGIzKqSel2r8MilRp59s3ZfBJjeKXIrUfoS-Zp-g/exec"
)

ENTRY_MAP = {
    "classID": "entry.543502435",
    "studentID": "entry.1745113091",
    "name": "entry.1972335137",
    "password": "entry.2095507383",
}

DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def resolve_default_csv_path() -> str:
    """Find 4CD.CSV in standard locations."""
    candidates = [
        r"D:\2627\WEB+\4CD.CSV",
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "4CD.CSV")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "4CD.CSV")),
        os.path.abspath(os.path.join(os.getcwd(), "4CD.CSV")),
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return candidates[0]


def load_students_from_csv(csv_path: str):
    """Load students from UTF-8 CSV."""
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"CSV file not found: {csv_path}")

    records = []
    with open(csv_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader, 1):
            cls = (row.get("班別") or "").strip()
            sid = (row.get("學號") or "").strip()
            name = (row.get("姓名") or "").strip()
            pwd = (row.get("口令") or "").strip()
            if not cls or not sid or not pwd:
                print(f"[WARN] Skipping invalid line {idx}: {row}")
                continue
            records.append({
                "classID": cls,
                "studentID": sid,
                "name": name,
                "password": pwd,
            })
    return records


def post_single_record(record: dict, timeout: int = 10, max_retries: int = 3, dry_run: bool = False):
    """Post single student record to Google Form with retry mechanism."""
    payload = {
        ENTRY_MAP["classID"]: record["classID"],
        ENTRY_MAP["studentID"]: record["studentID"],
        ENTRY_MAP["name"]: record["name"],
        ENTRY_MAP["password"]: record["password"],
    }

    if dry_run:
        print(f"  [DRY-RUN] Would POST: {record['classID']} #{record['studentID']} {record['name']} -> {record['password']}")
        return True, 200, "DRY_RUN_OK"

    encoded_data = urllib.parse.urlencode(payload).encode("utf-8")
    req = urllib.request.Request(
        FORM_RESPONSE_URL,
        data=encoded_data,
        headers={
            "User-Agent": DEFAULT_USER_AGENT,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST"
    )

    ctx = ssl.create_default_context()
    for attempt in range(1, max_retries + 1):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=timeout) as resp:
                status = resp.status
                if status in (200, 204, 302):
                    return True, status, "SUCCESS"
                else:
                    return False, status, f"Unexpected HTTP status {status}"
        except urllib.error.HTTPError as e:
            if attempt == max_retries:
                return False, e.code, f"HTTP Error: {e.reason}"
            time.sleep(1.0 * attempt)
        except Exception as e:
            if attempt == max_retries:
                return False, 0, f"Network Error: {str(e)}"
            time.sleep(1.0 * attempt)

    return False, 0, "Max retries exceeded"


def batch_sync(csv_path: str, delay: float = 0.3, timeout: int = 10, max_retries: int = 3, dry_run: bool = False):
    """Batch synchronize all student credentials to Google Form."""
    records = load_students_from_csv(csv_path)
    print(f"=== 4C/4D Google Form Batch Sync ===")
    print(f"Loaded {len(records)} students from {csv_path}")
    print(f"Target Form URL: {FORM_RESPONSE_URL}")
    print(f"Existing GAS Reader URL (Reused): {GAS_ENDPOINT_URL}")
    print(f"Mode: {'DRY-RUN (Simulated)' if dry_run else 'LIVE SUBMISSION'}")
    print(f"Delay: {delay}s | Timeout: {timeout}s | Retries: {max_retries}")
    print("=" * 40)

    success_count = 0
    fail_count = 0
    start_time = time.time()

    for idx, rec in enumerate(records, 1):
        print(f"[{idx:02d}/{len(records):02d}] Syncing {rec['classID']} #{rec['studentID']:>2} ({rec['name']}) -> {rec['password']}...", end=" ", flush=True)
        ok, status, msg = post_single_record(rec, timeout=timeout, max_retries=max_retries, dry_run=dry_run)
        if ok:
            success_count += 1
            print(f"[OK] ({status})")
        else:
            fail_count += 1
            print(f"[FAIL] ({status}: {msg})")

        if not dry_run and idx < len(records) and delay > 0:
            time.sleep(delay)

    elapsed = time.time() - start_time
    print("=" * 40)
    print(f"Sync Finished in {elapsed:.2f}s")
    print(f"Total: {len(records)} | Succeeded: {success_count} | Failed: {fail_count}")
    return success_count, fail_count


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch sync 4C/4D credentials to Google Form")
    parser.add_argument("--csv", default=resolve_default_csv_path(), help="Path to 4CD.CSV")
    parser.add_argument("--dry-run", action="store_true", help="Simulate POST without sending requests")
    parser.add_argument("--delay", type=float, default=0.3, help="Delay between requests in seconds")
    parser.add_argument("--timeout", type=int, default=10, help="Request timeout in seconds")
    parser.add_argument("--retries", type=int, default=3, help="Max retries per record")
    args = parser.parse_args()

    batch_sync(
        csv_path=args.csv,
        delay=args.delay,
        timeout=args.timeout,
        max_retries=args.retries,
        dry_run=args.dry_run
    )
