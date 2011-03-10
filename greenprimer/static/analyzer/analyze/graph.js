var graph = (function(self) {
    var graph, nodes, groups;

    var regraph = function() {
        graph = {};
        nodes = {};
        for(var i = 0; i < walls.all.length; i++) {

            var w1 = walls.all[i]
            if(w1.outer) continue;
            if(!graph[w1.id]) graph[w1.id] = [];
            nodes[w1.id] = true;

            for(var j = i+1; j < walls.all.length; j++) {

                var w2 = walls.all[j];
                if(w2.outer) continue;
                if(!w1.touches(w2)) continue;
                nodes[w2.id] = true;

                if(!graph[w2.id]) graph[w2.id] = [];
                graph[w1.id].push(w2.id);
                graph[w2.id].push(w1.id);
            }
        }
        console.log(graph, nodes);
    };

    var member = function(elem, list) {
        for(var i = 0; i < list.length; i++) {
            if(elem === list[i]) return true;
        }
        return false;
    };

    var getgroup = function() {
        var node = false, total = {};
        for(var i in nodes) {
            node = i;
            delete nodes[i];
            break;
        }
        if(!node) return false;
        var latest = [node];
        total[node] = true;

        for(var i = 0; i < latest.length; i++) {
            var next = graph[latest[i]];
            for(var j = 0; j < next.length; j++) {
                if(!total[next[j]]) {
                    latest.push(next[j]);
                    total[next[j]] = true;
                    delete nodes[next[j]];
                }
            }
        }

        return total;
    };
    
    var walk = function() {
        var group, groups = [];
        while(group = getgroup()) groups.push(group);
        return groups;
    };

    self.update = function() {
        warnings.forget(warnings.DISJOINT);
        regraph();
        groups = walk();
        console.log(groups);
        for(var i = 0; i < groups.length-1; i++) warnings.warn(warnings.DISJOINT);
    };

    $(function() {
    });

    return self;
})(graph || {});
