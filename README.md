# TimeLineLine

できるか知らんけどガントチャート的なものを表示・編集したい。

描画はブラウザに任せて、データは DL してあれこれさせておきたい。

## 書式

```jsonc
{
    // ガントチャート名
    "name": "ガントチャート",
    //"timezone": "JST",
    "calendar": {
        "range": {
            // 開始日時
            "from": "ISO8601",
            // 終了日時
            "to": "ISO8601",
        },
        // 定休日
        "holiday": {
            "regulars": [
                "saturday"
                "sunday"
            ],
            // 祝日とか
            "events": {
                "ISO8601": {
                    "display": "対象の日",
                    "kind": "holiday|special"
                }
            }
        }
    },
    // グループ
    "groups": [
        {
            "name": "グループ名",
            // メンバー一覧
            "members": {
                "id": "<MEMBER-ID>",
                "display": "表示名称",
                "color": "RGB"
            }
        }
    ],
    "theme": {
        "holiday": {
            "regulars": {
                "saturday": "RGB",
                "sunday": "RGB"
            },
            "events": {
                "holiday": "RGB",
                "special": "RGB",
            }
        },
        "groups": [
            // level: 0
            "RGB",
        ],
        "progress": "RGB",
    },
    "timelines": [
        {
            "kind": "marker",
            "scope": "global|local|slim",
            "color": "RGB",
            "subject": "マーカー名",
            // 対象日時
            "target": "ISO8601",
            "range": "ISO8601時刻",
            "comment": ""
        },
        {
            "kind": "pin",
            "type": "pin|line",
            "color": "RGB",
            "subject": "ピン件名",
            // 対象日時
            "target": "ISO8601",
            "comment": ""
        },
        {
            "kind": "timeline",
            "id": "<TIMELINE-ID>",
            "color": "RGB",
            "subject": "タイムライン名",
            "type": "group|item",
            // type: group
            "group": {
                // なんもねぇなぁ
            },
            // type: item
            "item": {
                // 固定と先行が設定されている場合最大を使用する
                // 固定
                "static": {
                    "target": "ISO8601",
                },
                // 先行 複数指定は全先行が終了する必要あり
                "prev": {
                    "items": [
                        "<TIMELINE-ID>",
                    ]
                },
                "range": "ISO8601時刻",
                "works": [
                    {
                        "member": "<MEMBER-ID>",
                        "state": "enabled|disabled|sleep",
                        "progress": 0-1,
                        "history": [
                            // 0: first history
                            {
                                "progress": 0-1,
                                "version": "<VERSION-ID>",
                                // あとどれくらいで終わんの？
                                "more": "ISO8601時刻"
                            }
                        ]
                    }
                ]
            },
            "comment": ""
        },
    ],
    "versions": [
        // 0: first history
        {
            "id": "<VERSION-ID>",
            "timestamp": "ISO8601"
        }
    ]
}
```