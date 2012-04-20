define(
    [ "dojo/string", "dojo/dom-construct", "dojo/dom-class", "dojo/dnd/Source", "dojo/text!/kk/kanbanCard.html", "dojo/text!/kk/kanbanColumn.html" ],
    function(stringUtil, domConstruct, domClass, Source, cardTemplate, columnTemplate){

        function removeSource(show, source, nodes){
            dojo.style(source[0], 'visibility', 'hidden');
        }
        function displaySource(show, source, nodes){
            dojo.style(source[0], 'visibility', 'visible');
        }

        function addListeners(){
            dojo.subscribe("/dnd/start", removeSource);
            dojo.subscribe("/dnd/drop", displaySource);
            // dojo.subscribe("/dnd/cancel, /dnd/drop", displaySource);

        }

        // create the DOM representation for the given item
        function cardCreator(item){
            var node = domConstruct.toDom(
                stringUtil.substitute(
                    cardTemplate,
                    {
                        name:           item.name,
                        quantity:       item.quantity,
                        description:    item.description
                    }
                )
            );
            return { node: node, data: item };
        }

        // create the DOM representation for the given item
        function workflowStepCreator(item){
            var node = domConstruct.toDom(
                stringUtil.substitute(
                    columnTemplate,
                    {
                        title: item.title,
                        id: item.id
                    }
                )
            );
            domConstruct.place(node,"innerContainer");
            return node;
        }

        // creates a dojo/dnd/Source from the data provided
        function buildCardList(node, data, selfAccept){

            // create the Source
            var dndObj = new Source(node, {
                // ensure that only move operations ever occur from this source
                copyOnly:   false,

                // define whether or not this source will accept drops from itself, based on the value passed into
                // buildCatalog; defaults to true, since this is the default that dojo/dnd uses
                selfAccept: selfAccept === undefined ? true : selfAccept,

                // use catalogNodeCreator as our creator function for inserting new nodes
                creator:    cardCreator
            });

            // insert new nodes to the Source; the first argument indicates that they will not be highlighted (selected)
            // when inserted
            dndObj.insertNodes(false, data);

            return dndObj;
        }

        // expose our API
        return {
            buildCardList:          buildCardList,
            workflowStepCreator:    workflowStepCreator,
            addListeners:           addListeners
        };
    }
);
