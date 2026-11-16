# Travel Log｜旅行檔案

Karina 嘅行程總表。**呢個表由 `_data/trips.csv` 自動生成，唔准手動改。**

網站（總表 + 逐個行程詳情頁）：<https://karinatkl.github.io/travel-log/>

| 行程 | 日期 | 晚 | 地區 | 類型 | 狀態 | 使費 HKD | 相／片 | 詳情 |
|---|---|---|---|---|---|---|---|---|
| **2026.1111-1113 深圳（南山／福田）** | 11-11 – 11-13 | 2 | Shenzhen | LEISURE | `COMPLETED` | 2508.7 | 8／0 | [詳情](trips/2026-11-shenzhen.md) |
| **2026.0920-1015 印尼峇里（Amed／Ubud／Canggu）** | 09-20 – 10-15 | 25 | Bali / Amed / Ubud / Canggu | DIGITAL_NOMAD | `COMPLETED` | — | 20／1 | [詳情](trips/2026-09-indonesia-bali.md) |
| **2026.0903-0908 韓國（首爾／安養）** | 09-03 – 09-08 | 5 | Seoul / Anyang | SPORT | `COMPLETED` | 4812.39 | 0／0 | [詳情](trips/2026-09-korea.md) |

---

## 點更新

1. 改 `_data/trips.csv` — 呢個係唯一真相來源
2. 加詳情頁：複製 `templates/trip-template.md` → `trips/<trip_id>.md`
3. 相放入 `photos/<trip_id>/`，命名 `001-短描述.jpg`
4. 片放 YouTube（預設 unlisted），連結寫入 `youtube_url` 欄
5. push 到 `main` → 本表自動重生成

## 狀態詞彙

`IDEA` → `PLANNING` → `BOOKED` → `CONFIRMED` → `ONGOING` → `COMPLETED` → `ARCHIVED`（或有任何階段 `CANCELLED`）
