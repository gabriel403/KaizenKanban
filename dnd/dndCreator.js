define(
    [ "dojo/string", "dojo/dom-construct", "dojo/dom-class", "dojo/dnd/Source", "dojo/text!/dnd/kanbanCard.html" ],
    function(stringUtil, domConstruct, domClass, Source, template){

        // create the DOM representation for the given item
        function catalogNodeCreator(item){
            var node = domConstruct.toDom(
                stringUtil.substitute(
                    template,
                    {
                        name: item.name,
                        quantity: item.quantity,
                        description: "<br><span>" + item.description + "</span>"
                    }
                )
            ),
            type = item.quantity ? [ "inStock" ] : [ "outOfStock" ];
            return { node: node, data: item, type: type };
        }

        // creates a dojo/dnd/Source from the data provided
        function buildCatalog(node, data, selfAccept){

            // create the Source
            var dndObj = new Source(node, {
                // ensure that only move operations ever occur from this source
                copyOnly: false,

                // define whether or not this source will accept drops from itself, based on the value passed into
                // buildCatalog; defaults to true, since this is the default that dojo/dnd uses
                selfAccept: selfAccept === undefined ? true : selfAccept,

                // use catalogNodeCreator as our creator function for inserting new nodes
                creator: catalogNodeCreator
            });

            // insert new nodes to the Source; the first argument indicates that they will not be highlighted (selected)
            // when inserted
            dndObj.insertNodes(false, data);

            // add CSS hooks for element styling
            dndObj.forInItems(function(item, id, map){
                domClass.add(id, item.type[0]);
            });

            return dndObj;
        }

        // expose our API
        return {
            buildCatalog: buildCatalog
        };
    }
);
