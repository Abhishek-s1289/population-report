## How to use: odata-v4-parser

<!-- odataUri(decodeURI(req.url)); -->

Example (Read One):
1. /City('New York')   -  ReadOne scenario with only one primary key.

    - singleKey: string = ast.value.resource.value.navigation.value.path.value.predicate.value.value.raw;
    - singleKey = 'New York'

2. /City(name='New York',area=468.9)   -   ReadOne scenario with multiple primary keys.

    - predicate = ast.value.resource.value.navigation.value.path.value.predicate
    - predicate ===> {raw: '(name='Hello',area=2)', type: 'CompoundKey'}
    - multiKeyArr:[] = predicate.value

    - let keysMap = {} // {name: 'New York', area: 468.9}
    - for (let keypair of multiKeyArr) {
        - keys[keypair.value.key.value.name] = keypair.value.value.raw
    - }



Example (Read Many with query):  

1. /City?$filter=(contains(name, 'New Yo') and area ge 200) or population le 100000&$orderby=name&$top=10

When I paas this uri to the parser, it returns an ast.
The ast will contain following information-

- ast.value.resource.value.resource ==> {raw:'City', type:'EntitySetName'}

- ast.value.query.value.options returns an array. In our case, it will return three objects for $filter, $select and $top
- ast.value.query.value.options[index].type will be 'Filler'/'OrderBy'/'Top' etc in this case.

lets check each of the items inside options:

- ast.value.query.value.options[0].type is 'Filter'
- ast.value.query.value.options[0].value.type is 'OrExpression'
- ast.value.query.value.options[0].value.left.type is 'BoolParenExpression'
- value.query.value.options[0].value.left.value.type is 'AndExpression'
- ast.value.query.value.options[0].value.left.value.left.type is 'MethodCallExpression'
- ast.value.query.value.options[0].value.left.value.left.value.method is 'contains'
- ast.value.query.value.options[0].value.left.value.left.value.parameters[0].raw is 'name'
- ast.value.query.value.options[0].value.left.value.left.value.parameters[1].raw is 'New Yo'
- ast.value.query.value.options[0].value.left.value.right.type is 'GreaterOrEqualsExpression'
- ast.value.query.value.options[0].value.left.value.right.value.left.raw is 'area'
- ast.value.query.value.options[0].value.left.value.right.value.right.raw is 200
- ast.value.query.value.options[0].value.right.type is 'LesserOrEqualsExpression'
- ast.value.query.value.options[0].value.right.value.left.raw is 'population'
- ast.value.query.value.options[0].value.right.value.right.raw is 100000

###############

- ast.value.query.value.options[1].type is 'OrderBy'
- ast.value.query.value.options[1].value.items[0].value.raw is 'name'

##############
- ast.value.query.value.options[2].type is 'Top'
- ast.value.query.value.options[2].value.raw is 10
