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
		"import",
		"no-relative-import-paths",
		"unused-imports",
		"@typescript-eslint"
	],
	"rules": {
		"quotes": [
			"error",
			"double"
		],
		"eqeqeq": [
			"error",
		],
		/*
		"no-tabs": [
			"error",
			{
				"allowIndentationTabs": true,
			}
		],
		*/
		"semi": [
			"error",
			"always"
		],
		"no-extra-semi": [
			"error",
		],
		"semi-spacing": [
			"error",
			{
				"before": false,
				"after": true
			}
		],
		"no-cond-assign": [
			"error",
		],
		"no-func-assign": [
			"error",
		],
		"no-invalid-regexp": [
			"error",
		],
		"no-loop-func": [
			"error",
		],
		"no-octal-escape": [
			"error",
		],
		"no-implicit-coercion": [
			"error",
		],
		"no-inner-declarations": [
			"error",
		],
		"no-param-reassign": [
			"error",
			{
				"props": false
			}
		],
		"import/order": [
			"warn",
			{
				"groups": [
					"builtin",
					"external",
					"internal",
					"parent",
					"sibling",
					"index",
					"object",
					"type",
				],
				"newlines-between": "always",
				"pathGroupsExcludedImportTypes": [
					"builtin"
				],
				"alphabetize": {
					"order": "asc",
					"caseInsensitive": true
				},
				/*
				"pathGroups": [
					{
						"pattern": "",
						"group": "internal",
						"position": ""
					},
				]
				*/
			}
		],
		"no-relative-import-paths/no-relative-import-paths": [
			"error", {
				"allowSameFolder": false,
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
		],
		"@typescript-eslint/no-non-null-assertion": [
			"error"
		]
	}
};
