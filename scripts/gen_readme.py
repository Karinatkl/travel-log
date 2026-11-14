#!/usr/bin/env python3
"""由 _data/trips.csv 重寫 README.md 的總表。

用途：GitHub Actions 喺 push 到 main 之後自動跑，唔准手改 README。
同時做 §10 嘅基本檢查，有錯就以 exit 1 失敗，唔會靜靜地寫入壞資料。
"""

import csv
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "_data", "trips.csv")
OUT_PATH = os.path.join(ROOT, "README.md")
TRIPS_DIR = os.path.join(ROOT, "trips")

EXPECTED_COLS = 21
VALID_STATUS = {
    "IDEA", "PLANNING", "BOOKED", "CONFIRMED",
    "ONGOING", "COMPLETED", "ARCHIVED", "CANCELLED",
}

HEAD = """# Travel Log｜旅行檔案

Karina 嘅行程總表。**呢個表由 `_data/trips.csv` 自動生成，唔准手動改。**

網站（總表 + 逐個行程詳情頁）：<https://karinatkl.github.io/travel-log/>

"""

TAIL = """
---

## 點更新

1. 改 `_data/trips.csv` — 呢個係唯一真相來源
2. 加詳情頁：複製 `templates/trip-template.md` → `trips/<trip_id>.md`
3. 相放入 `photos/<trip_id>/`，命名 `001-短描述.jpg`
4. 片放 YouTube（預設 unlisted），連結寫入 `youtube_url` 欄
5. push 到 `main` → 本表自動重生成

## 狀態詞彙

`IDEA` → `PLANNING` → `BOOKED` → `CONFIRMED` → `ONGOING` → `COMPLETED` → `ARCHIVED`（或有任何階段 `CANCELLED`）
"""


def die(msg):
    sys.stderr.write("✗ %s\n" % msg)
    sys.exit(1)


def load():
    if not os.path.exists(CSV_PATH):
        die("搵唔到 %s" % CSV_PATH)
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        rows = list(reader)
    if not rows:
        die("trips.csv 完全空白")
    header = rows[0]
    if len(header) != EXPECTED_COLS:
        die("表頭有 %d 欄，應該係 %d 欄" % (len(header), EXPECTED_COLS))
    body = [r for r in rows[1:] if any(c.strip() for c in r)]
    return header, body


def validate(header, body):
    problems = []
    seen = set()
    idx = {name: i for i, name in enumerate(header)}
    for n, row in enumerate(body, start=2):
        if len(row) != EXPECTED_COLS:
            problems.append("第 %d 行有 %d 欄（應該 21）" % (n, len(row)))
            continue
        tid = row[idx["trip_id"]].strip()
        if not tid:
            problems.append("第 %d 行冇 trip_id" % n)
            continue
        if tid in seen:
            problems.append("重複 trip_id：%s" % tid)
        seen.add(tid)
        if row[idx["status"]].strip() not in VALID_STATUS:
            problems.append("%s 嘅 status 唔合法：%s" % (tid, row[idx["status"]]))
        start, end = row[idx["start_date"]].strip(), row[idx["end_date"]].strip()
        if start > end:
            problems.append("%s 嘅 start_date 遲過 end_date" % tid)
        detail = row[idx["detail_path"]].strip()
        if detail and not os.path.exists(os.path.join(ROOT, detail)):
            problems.append("%s 嘅 detail_path 檔案唔存在：%s" % (tid, detail))
    return problems


def cell(value, dash="—"):
    v = (value or "").strip()
    if not v:
        return dash
    return v.replace("|", "\\|")


def render(header, body):
    idx = {name: i for i, name in enumerate(header)}
    if not body:
        return HEAD + "_仲未有行程。改 `_data/trips.csv` 加第一行。_\n" + TAIL

    body.sort(key=lambda r: r[idx["start_date"]], reverse=True)

    lines = [
        "| 行程 | 日期 | 晚 | 地區 | 類型 | 狀態 | 使費 HKD | 相／片 | 詳情 |",
        "|---|---|---|---|---|---|---|---|---|",
    ]
    for r in body:
        tid = r[idx["trip_id"]].strip()
        title = cell(r[idx["title_zh"]], tid)
        dates = "%s – %s" % (r[idx["start_date"]][5:], r[idx["end_date"]][5:])
        spent = r[idx["spent_hkd"]].strip()
        budget = r[idx["budget_hkd"]].strip()
        money = spent if spent else ("~%s" % budget if budget else "—")
        photos = r[idx["photo_count"]].strip() or "0"
        videos = r[idx["video_count"]].strip() or "0"
        link = "[詳情](trips/%s.md)" % tid
        lines.append("| **%s** | %s | %s | %s | %s | `%s` | %s | %s／%s | %s |" % (
            title,
            dates,
            cell(r[idx["nights"]]),
            cell(r[idx["city"]], cell(r[idx["country"]])),
            cell(r[idx["trip_type"]]),
            cell(r[idx["status"]]),
            money,
            photos, videos,
            link,
        ))
    return HEAD + "\n".join(lines) + "\n" + TAIL


def main():
    header, body = load()
    problems = validate(header, body)
    if problems:
        die("檢查唔過：\n  - " + "\n  - ".join(problems))

    text = render(header, body)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(text)
    print("✓ README.md 已重生成（%d 個行程）" % len(body))


if __name__ == "__main__":
    main()
