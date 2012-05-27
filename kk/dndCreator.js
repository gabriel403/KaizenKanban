define([ "dojo/on", "dojo", "dojo/query", "dojo/dom-style", "dojo/string",
     "dojo/dom-construct", "dojo/dom-class", "dojo/dnd/Source",
     "dojo/text!/kk/kanbanCard.html", "dojo/text!/kk/kanbanColumn.html", "dojo/aspect", "dojo/topic" ],
    function(on, dojo, query, domStyle, stringUtil,
     domConstruct, domClass, Source,
     cardTemplate, columnTemplate, aspect, topic){

        var movingNode = null;

        var mover = [], mout = [], dndStart = 0, dndDrop = 0, dndCancel = 0;

        function moveStart(show, source, nodes){
            movingNode = source[0];
            domStyle.set(source[0], 'visibility', 'hidden');
            domStyle.set(query('.dojoDndAvatar')[0], 'width', domStyle.get(source[0], 'width')+'px');
            domStyle.set(query('.dojoDndAvatar')[0], 'height', domStyle.get(source[0], 'height')+'px');
            domStyle.set(source[0], 'display', 'none');

        }

        function moveStop(source, nodes, copy){
            //source.node.id ul catNode
            movingNode = null;
            query('.dojoDndItemAnchor').style('display', 'block');
            query('.dojoDndItemAnchor').style('visibility', 'visible');
        }

        function moveOver(e){
            if ( null == movingNode ) {
                return;
            }

            var itemOver = this.current;
            if ( null == itemOver ) {
                return;
            }

            var position = domClass.contains(itemOver, 'dojoDndItemBefore')?'before':'after';
            domStyle.set(movingNode, 'display', 'block');
            dojo.place(movingNode, itemOver, position);
        }

        function moveOut(e){
            if ( null == movingNode ) {
                return;
            }
            domStyle.set(movingNode, 'display', 'none');
        }

        function addListeners(source){
            if ( null == source )
            {
                return;
            }
            mover.push(aspect.after(source, '_markTargetAnchor', moveOver, true));
            mout.push(aspect.after(source, 'onDraggingOut', moveOut, true));

            dndStart    = 0 == dndStart   ? topic.subscribe("/dnd/start", moveStart)  : dndStart;
            dndDrop     = 0 == dndDrop    ? topic.subscribe("/dnd/drop", moveStop)    : dndDrop;
            dndCancel   = 0 == dndCancel  ? topic.subscribe("/dnd/cancel", moveStop)  : dndCancel;
            //topic.subscribe("/dnd/source/over", moveStop);
        }

        // create the DOM representation for the given item
        function cardCreator(item){
            var node = domConstruct.toDom(
                stringUtil.substitute(
                    cardTemplate,
                    {
                        name:           item.name[0],
                        quantity:       item.quantity[0],
                        description:    item.description[0]
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
                copyOnly:       false,

                // define whether or not this source will accept drops from itself, based on the value passed into
                // buildCatalog; defaults to true, since this is the default that dojo/dnd uses
                selfAccept:     selfAccept === undefined ? true : selfAccept,

                // use catalogNodeCreator as our creator function for inserting new nodes
                creator:        cardCreator,
                withHandles:    true
            });

            // insert new nodes to the Source; the first argument indicates that they will not be highlighted (selected)
            // when inserted
            dndObj.insertNodes(false, data);

            //if ( !listenersAdded ) {
                this.addListeners(dndObj);
            //}

            return dndObj;
        }

        // expose our API
        return {
            buildCardList:          buildCardList,
            workflowStepCreator:    workflowStepCreator,
            addListeners:           addListeners,
            moveOver:               moveOver
        };
    }
);
