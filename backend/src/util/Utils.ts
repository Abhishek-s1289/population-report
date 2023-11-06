import { type Token, TokenType } from "odata-v4-parser/lib/lexer";
import fs from "fs/promises";
import type { Encoding } from "crypto";

export default class Utils {
	private static _instance: Utils;
	public static gI() {
		if (!Utils._instance) {
			Utils._instance = new Utils();
		}
		return Utils._instance;
	}

	public filterEntitySet(entitySet: any[], filterNode: Token): any[] {
		return entitySet.filter((entity) => this._handleFilter(entity, filterNode));
	}

	public sortEntitySet(entitySet: any[], sortNode: Token): any[] {
		let sortOptions: { [prop: string]: "asc" | "desc" } = sortNode.value.items.reduce((acc, item) => {
			let [prop, criteria = "asc"] = item.raw.split(" ");
			acc[prop] = criteria;
			return acc;
		}, {});

		return entitySet.sort((a, b) => {
			for (let prop in sortOptions) {
				let criteria = sortOptions[prop];
				let propA = a[prop];
				let propB = b[prop];
				
				switch(criteria){
					case 'asc':
						return propA < propB ? -1 : 1;
					case 'desc':
						return propA > propB ? -1 : 1;
					default:
						throw new Error('Invalid sort !');
				}
			}
			return 0;
		});
	}

	private _handleFilter(entity: any, node: Token): boolean {
		switch (node.type) {
			case TokenType.AndExpression:
				return this._handleFilter(entity, node.value.left) && this._handleFilter(entity, node.value.right);
			case TokenType.OrExpression:
				return this._handleFilter(entity, node.value.left) || this._handleFilter(entity, node.value.right);
			case TokenType.MethodCallExpression:
				if (node.value.method.toLowerCase() === "contains") {
					const propertyName = node.value.parameters[0].raw;
					const searchValue = this._parseODataLiteral(node.value.parameters[1].raw, node.value.parameters[1].value);
					return entity[propertyName].toLowerCase().includes(searchValue.toLowerCase());
				}
				return false;
			case TokenType.EqualsExpression:
				return entity[node.value.left.raw] === this._parseODataLiteral(node.value.right.raw, node.value.right.value);
			case TokenType.GreaterThanExpression:
				return entity[node.value.left.raw] > this._parseODataLiteral(node.value.right.raw, node.value.right.value);
			case TokenType.LesserThanExpression:
				return entity[node.value.left.raw] < this._parseODataLiteral(node.value.right.raw, node.value.right.value);
			case TokenType.GreaterOrEqualsExpression:
				return entity[node.value.left.raw] >= this._parseODataLiteral(node.value.right.raw, node.value.right.value);
			case TokenType.LesserOrEqualsExpression:
				return entity[node.value.left.raw] <= this._parseODataLiteral(node.value.right.raw, node.value.right.value);
			default:
				return false;
		}
	}

	private _parseODataLiteral(literal: string, type: string): any {
		switch (type) {
			case "Edm.String":
				if (literal.startsWith("'") || literal.startsWith('"')) literal = literal.slice(1, -1);
				return String(literal);
			case "Edm.Int16":
			case "Edm.Int32":
				return parseInt(literal);
			case "Edm.Double":
				return parseFloat(literal);
			default:
				return literal;
		}
	}

	public async readFromJSON(filePath: string, encoding: Encoding): Promise<string>{
		const rawData = await fs.readFile(filePath, encoding);
		return rawData;
	}

	public async writeToJSON(filePath: string, data: string, encoding: Encoding): Promise<boolean>{
		await fs.writeFile(filePath, data, encoding);
		return true;
	}
}
