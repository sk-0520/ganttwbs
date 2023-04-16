module.exports = {
	"root": true,
	"env": {
		"browser": true,
		"es2020": true
	},
	"extends": [
		"plugin:@typescript-eslint/recommended",
		"next",
		"next/core-web-vitals"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"sourceType": "module"
	},
	"plugins": [
		"no-relative-import-paths",
		"unused-imports",
		"@typescript-eslint"
	],
	"rules": {
		"quotes": [
			"error",
			"double"
		],
		/*
		"no-tabs": [
			"error",
			{
				"allowIndentationTabs": true,
			}
		],
		*/
		"no-relative-import-paths/no-relative-import-paths": [
			"error", {
				"allowSameFolder": true,
				"rootDir": "src",
				"prefix": "@"
			}
		],
		"unused-imports/no-unused-imports": [
			"error"
		],
		"react/jsx-indent": [
			"error",
			"tab"
		],
		"@typescript-eslint/no-empty-interface": [
			"error",
			{
				"allowSingleExtends": true
			}
		],
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				//"argsIgnorePattern": "^_*$",
				"argsIgnorePattern": "^.*$",
				"varsIgnorePattern": "^_*$"
			}
		]
	}
};
