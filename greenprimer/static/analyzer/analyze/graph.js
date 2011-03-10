var graph = (function(self) {
    var graph, nodes, groups, biggest, counts, map, disjointed = [];

    var regraph = function() {
        graph = {};
        nodes = {};
        map = {};
        biggest = 0;
        for(var i = 0; i < walls.all.length; i++) {

            var w1 = walls.all[i]
            if(w1.outer) continue;
            if(!graph[w1.id]) graph[w1.id] = [];
            nodes[w1.id] = true;
            map[w1.id] = w1;

            for(var j = i+1; j < walls.all.length; j++) {

                var w2 = walls.all[j];
                if(w2.outer) continue;
                if(!w1.touches(w2)) continue;
                nodes[w2.id] = true;
                map[w2.id] = w2;

                if(!graph[w2.id]) graph[w2.id] = [];
                graph[w1.id].push(w2.id);
                graph[w2.id].push(w1.id);
            }
        }
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
        var length = 0;

        for(var i = 0; i < latest.length; i++) {
            var next = graph[latest[i]];
            for(var j = 0; j < next.length; j++) {
                if(!total[next[j]]) {
                    latest.push(next[j]);
                    total[next[j]] = true;
                    length++;
                    delete nodes[next[j]];
                }
            }
        }

        if(length > biggest) biggest = length;
        return [total, length];
    };
    
    var walk = function() {
        var result;
        groups = [], counts = [];
        while(result = getgroup()) {
            groups.push(result[0]);
            counts.push(result[1]);
        }
    };

    self.update = function() {
        for(var i = 0; i < disjointed.length; i++) {
            disjointed[i].rejoin();
        }
        disjointed = [];
        warnings.forget(warnings.DISJOINT);
        regraph(); walk();
        console.log(groups, counts, map, biggest);
        for(var i = 0; i < groups.length; i++) {
            if(counts[i] === biggest) continue;
            for(var j in groups[i]) disjointed.push(map[j].disjoin());
        }
        warnings.warn(warnings.DISJOINT, groups.length-1);
    };

    $(function() {
    });

    return self;
})(graph || {});
