# Travel Log｜旅行檔案

Karina 嘅行程總表。**呢個表由 `_data/trips.csv` 自動生成，唔准手動改。**

網站（總表 + 逐個行程詳情頁）：<https://karinatkl.github.io/travel-log/>

| 行程 | 日期 | 晚 | 地區 | 類型 | 狀態 | 使費 HKD | 相／片 | 詳情 |
|---|---|---|---|---|---|---|---|---|
| **2026.1111-1113 深圳（南山／福田）** | 11-11 – 11-13 | 2 | Shenzhen | LEISURE | `COMPLETED` | 2508.7 | 8／0 | [詳情](trips/2026-11-shenzhen.md) |
| **2026.0920-1015 印尼峇里（Amed／Ubud／Canggu）** | 09-20 – 10-15 | 25 | Bali / Amed / Ubud / Canggu | DIGITAL_NOMAD | `COMPLETED` | — | 20／1 | [詳情](trips/2026-09-indonesia-bali.md) |
| **2026.0903-0908 韓國（首爾／安養）** | 09-03 – 09-08 | 5 | Seoul / Anyang | SPORT | `COMPLETED` | 4812.39 | 20／1 | [詳情](trips/2026-09-korea.md) |
| **20260810-14 深圳西涌** | 08-10 – 08-14 | 4 | Shenzhen / Xichong | SPORT | `COMPLETED` | 5874 | 20／1 | [詳情](trips/2026-08-shenzhen-xichong.md) |
| **2026.0629-0703 富國島** | 06-29 – 07-03 | 4 | Phu Quoc | LEISURE | `COMPLETED` | — | 0／0 | [詳情](trips/2026-06-vietnam-phu-quoc.md) |
| **2026.0408-0415 台灣 ymq** | 04-08 – 04-15 | 7 | Taipei | SPORT | `COMPLETED` | — | 0／0 | [詳情](trips/2026-04-taiwan-ymq.md) |
| **2026.0406-0407 深圳蛇口** | 04-06 – 04-07 | 1 | Shenzhen / Shekou | SPORT | `COMPLETED` | — | 0／0 | [詳情](trips/2026-04-shenzhen-shekou.md) |
| **2026.0322-0329 廣州** | 03-22 – 03-29 | 7 | Guangzhou | LEISURE | `COMPLETED` | — | 0／0 | [詳情](trips/2026-03-guangzhou.md) |
| **2026.0221-0222 珠海** | 02-21 – 02-22 | 1 | Zhuhai | LEISURE | `COMPLETED` | — | 0／0 | [詳情](trips/2026-02-zhuhai.md) |
| **2026.0116-0124 仙台・東京（藏王滑雪）** | 01-16 – 01-24 | 8 | Sendai / Tokyo / Zao | SPORT | `COMPLETED` | — | 0／0 | [詳情](trips/2026-01-japan-sendai-tokyo.md) |
| **2026.0108-0109 澳門** | 01-08 – 01-09 | 1 | Macau | LEISURE | `COMPLETED` | — | 0／0 | [詳情](trips/2026-01-macau.md) |

---

## 點更新

1. 改 `_data/trips.csv` — 呢個係唯一真相來源
2. 加詳情頁：複製 `templates/trip-template.md` → `trips/<trip_id>.md`
3. 相放入 `photos/<trip_id>/`，命名 `001-短描述.jpg`
4. 片放 YouTube（預設 unlisted），連結寫入 `youtube_url` 欄
5. push 到 `main` → 本表自動重生成

## 狀態詞彙

`IDEA` → `PLANNING` → `BOOKED` → `CONFIRMED` → `ONGOING` → `COMPLETED` → `ARCHIVED`（或有任何階段 `CANCELLED`）
