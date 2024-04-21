# GanttWBS

できるか知らんけどガントチャート的なものを表示・編集したい。

描画はブラウザに任せて、データは DL してあれこれさせておきたい。

## Debug VSCode

```jsonc
{
	"version": "0.2.0",
	"configurations": [
		{
			"type": "node",
			"request": "attach",
			"name": "Server",
			"skipFiles": [
				"<node_internals>/**"
			],
			"port": 9229
		},
		{
			"type": "firefox",
			"name": "Firefox",
			"request": "launch",
			"reAttach": true,
			"url": "http://localhost:3000",
			"webRoot": "${workspaceFolder}",
			"pathMappings": [
				{
					"url": "webpack://_n_e",
					"path": "${workspaceFolder}"
				}
			]
		},
		{
			"type": "pwa-chrome",
			"request": "launch",
			"name": "Chrome",
			"url": "http://localhost:3000",
			"webRoot": "${workspaceFolder}"
		}
	]
}
```
